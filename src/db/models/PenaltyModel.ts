import { Table, Column, Model, ForeignKey, BelongsTo, AfterBulkCreate } from "sequelize-typescript";
import sequelize from "sequelize";

import { StudentModel } from "./StudentModel";
import { EmailService, getHtmlContent, SendEmailDto } from "../../services/EmailService";
import { UserModel } from "./UserModel";
import path from "path";
import { env, IEnvironmentVariables } from "../../config";

const environmentVariables: IEnvironmentVariables = env();
const { MAIL_USER, APP_NAME, DEFAULT_MAIL_TO, SEND_MAIL } = environmentVariables;

@Table({
  tableName: "Penalty",
})
export class PenaltyModel extends Model<PenaltyModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @ForeignKey(() => StudentModel)
  @Column({ type: sequelize.UUID, allowNull: false })
  studentId: string;

  @BelongsTo(() => StudentModel, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
  })
  student: StudentModel;

  @Column({
    type: sequelize.INTEGER,
    allowNull: false,
  })
  penalty: number;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  reason: string;

  @AfterBulkCreate
  static async sendEmailHook(instance: PenaltyModel[]) {
    if (SEND_MAIL == "FALSE") return;
    const mailerService = new EmailService();
    const students = await StudentModel.findAll({
      where: {
        id: instance.map((penalty) => penalty.studentId),
      },
      include: [
        {
          model: UserModel,
          as: "user",
        },
      ],
    });

    const studentDict = students.reduce((acc, student) => {
      acc[student.id] = student;

      return acc;
    }, {});

    const penalties = instance.map((penalty) => {
      const penaltyData = penalty.dataValues;

      return {
        ...penaltyData,
        student: studentDict[penaltyData.studentId],
      };
    });

    const templatePath = path.resolve(process.cwd(), "./src/html", "PenaltyToStudent.html");

    for (const penaltyItem of penalties) {
      const amount = penaltyItem.penalty.toString();
      const replacements = {
        studentName: penaltyItem.student.user.name,
        reason: penaltyItem.reason,
        amount: amount,
      };
      const emailHtmlContent = getHtmlContent(templatePath, replacements);
      const data: SendEmailDto = {
        from: { name: APP_NAME, address: MAIL_USER },
        // recepients: [{ address: DEFAULT_MAIL_TO }],
        recepients: [{ address: penaltyItem.student.user.email }],
        subject: `Penalty Imposed Due to ${penaltyItem.reason}`,
        html: emailHtmlContent,
      };

      await mailerService.sendEmail(data);
    }
  }
}
