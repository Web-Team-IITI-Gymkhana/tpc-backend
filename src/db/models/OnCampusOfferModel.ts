import { Model, Column, Table, ForeignKey, Unique, BelongsTo, AfterBulkCreate } from "sequelize-typescript";
import sequelize from "sequelize";
import { StudentModel } from "./StudentModel";
import { SalaryModel } from "./SalaryModel";
import { OfferStatusEnum } from "src/enums";
import { EmailService } from "src/services/EmailService";
import { SendEmailDto } from "src/services/EmailService";
import { UserModel } from "./UserModel";
import { IEnvironmentVariables, env } from "src/config";
import { NotFoundException } from "@nestjs/common";

const environmentVariables: IEnvironmentVariables = env();
const { MAIL_USER, APP_NAME, DEFAULT_MAIL_TO } = environmentVariables;

@Table({
  tableName: "OnCampusOffer",
})
export class OnCampusOfferModel extends Model<OnCampusOfferModel> {
  @Column({
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Unique("StudentJobSalaryUnique")
  @ForeignKey(() => StudentModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  studentId: string;

  @BelongsTo(() => StudentModel, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
  })
  student: StudentModel;

  @Unique("StudentJobSalaryUnique")
  @ForeignKey(() => SalaryModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  salaryId: string;

  // Delete OnCampusOffer onDelete of Salary
  @BelongsTo(() => SalaryModel, {
    foreignKey: "salaryId",
    onDelete: "CASCADE",
  })
  salary: SalaryModel;

  @Column({
    type: sequelize.ENUM(...Object.values(OfferStatusEnum)),
    allowNull: false,
  })
  status: OfferStatusEnum;

  @Column({
    type: sequelize.STRING,
  })
  metadata?: string;

  @AfterBulkCreate
  static async sendEmailHook(instance: OnCampusOfferModel[]) {
    const mailerService = new EmailService();

    for (const offer of instance) {
      const student = await StudentModel.findByPk(offer.studentId, {
        include: [
          {
            model: UserModel,
            as: "user",
          },
        ],
      });
      if (!student) {
        throw new NotFoundException(`Student not found for offer ${offer.id}`);
        continue;
      }
      if (!student.user) {
        throw new NotFoundException(`User not found for student ${student.id}`);
        continue;
      }

      const dto: SendEmailDto = {
        from: { name: APP_NAME, address: MAIL_USER },
        // recepients: [{ address: DEFAULT_MAIL_TO }],
        recepients: [{ address: student.user.email }],
        subject: "Test email",
        html: `<p>Hi ${student.user.name}, there is an onCampus Offer for you</p>`,
      };

      await mailerService.sendEmail(dto);
    }
  }
}
