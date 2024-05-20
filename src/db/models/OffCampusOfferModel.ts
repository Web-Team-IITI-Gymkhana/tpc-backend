/* eslint-disable no-console */
import sequelize from "sequelize";
import { Model, Column, Table, ForeignKey, Unique, BelongsTo, AfterBulkCreate } from "sequelize-typescript";
import { CompanyModel } from "./CompanyModel";
import { SeasonModel } from "./SeasonModel";
import { StudentModel } from "./StudentModel";
import { OfferStatusEnum } from "src/enums";
import { EmailService } from "src/services/EmailService";
import { SendEmailDto } from "src/services/EmailService";
import { UserModel } from "./UserModel";

@Table({
  tableName: "OffCampusOffer",
})
export class OffCampusOfferModel extends Model<OffCampusOfferModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Unique("Student-Season-CompanyUnique")
  @ForeignKey(() => StudentModel)
  @Column({ type: sequelize.UUID, allowNull: false })
  studentId: string;

  // Delete Off Campus Offer onDelete of Student
  @BelongsTo(() => StudentModel, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
  })
  student: StudentModel;

  @Unique("Student-Season-CompanyUnique")
  @ForeignKey(() => SeasonModel)
  @Column({ type: sequelize.UUID, allowNull: false })
  seasonId: string;

  // Delete Off Campus Offer onDelete of Season
  @BelongsTo(() => SeasonModel, {
    foreignKey: "seasonId",
    onDelete: "CASCADE",
  })
  season: SeasonModel;

  @Unique("Student-Season-CompanyUnique")
  @ForeignKey(() => CompanyModel)
  @Column({ type: sequelize.UUID, allowNull: false })
  companyId: string;

  // Restrict Delete Off Campus Offer onDelete of Company
  @BelongsTo(() => CompanyModel, {
    foreignKey: "companyId",
    onDelete: "RESTRICT",
  })
  company: CompanyModel;

  @Column({
    type: sequelize.FLOAT,
    allowNull: false,
  })
  salary: number;

  @Column({
    type: sequelize.STRING,
  })
  salaryPeriod?: string;

  @Column({
    type: sequelize.STRING,
  })
  metadata?: string;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  role: string;

  //@todo make enum of this.
  @Column({
    type: sequelize.ENUM(...Object.values(OfferStatusEnum)),
    allowNull: false,
    defaultValue: OfferStatusEnum.ONGOING,
  })
  status: OfferStatusEnum;

  @AfterBulkCreate
  static async sendEmailHook(instance: OffCampusOfferModel[]) {
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
      const dto: SendEmailDto = {
        from: { name: "TPC Portal", address: "aryangkulkarni@gmail.com" },
        // recepients: [{ address: "me210003016@iiti.ac.in" }],  // Put your email address for testing
        recepients: [{ address: user.email }],
        subject: "Test email",
        html: `<p>Hi ${user.name}, there is an offCampus Offer for you</p>`,
      };

      // Send email
      await mailerService.sendEmail(dto);
    }
  }
}
