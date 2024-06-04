/* eslint-disable no-console */
import { Model, Column, Table, ForeignKey, Unique, BelongsTo, AfterBulkCreate } from "sequelize-typescript";
import sequelize from "sequelize";
import { StudentModel } from "./StudentModel";
import { SalaryModel } from "./SalaryModel";
import { OfferStatusEnum } from "src/enums";
import { EmailService } from "src/services/EmailService";
import { SendEmailDto } from "src/services/EmailService";
import { UserModel } from "./UserModel";
import { IEnvironmentVariables, env } from "src/config";

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
    console.log("New entries created");
    const mailerService = new EmailService();

    // Iterate over each newly created instance
    for (const offer of instance) {
      // Find the student associated with this offer
      const student = await StudentModel.findByPk(offer.studentId);
      if (!student) {
        console.error(`Student not found for offer ${offer.id}`);
        continue; // Skip to the next offer if student not found
      }

      // Find the user associated with this student
      const user = await UserModel.findByPk(student.userId);
      if (!user) {
        console.error(`User not found for student ${student.id}`);
        continue; // Skip to the next offer if user not found
      }

      // Prepare the email data
      const data: SendEmailDto = {
        from: { name: APP_NAME, address: MAIL_USER },
        recepients: [{ address: DEFAULT_MAIL_TO }], // Put your email address for testing
        // recepients: [{ address: user.email }],
        subject: "OnCampus Offer",
        html: `<p>Hi ${user.name}, there is an onCampus Offer for you</p>`,
      };

      // Send email
      await mailerService.sendEmail(data);
    }
  }
}
