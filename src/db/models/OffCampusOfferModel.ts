import sequelize from "sequelize";
import { Model, Column, Table, ForeignKey, Unique, BelongsTo, AfterBulkCreate } from "sequelize-typescript";
import { CompanyModel } from "./CompanyModel";
import { SeasonModel } from "./SeasonModel";
import { StudentModel } from "./StudentModel";
import { OfferStatusEnum } from "src/enums";
import { EmailService } from "src/services/EmailService";
import { SendEmailDto } from "src/services/EmailService";
import { UserModel } from "./UserModel";
import { IEnvironmentVariables, env } from "src/config";
import { NotFoundException } from "@nestjs/common";

const environmentVariables: IEnvironmentVariables = env();
const { MAIL_USER, APP_NAME, DEFAULT_MAIL_TO } = environmentVariables;

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
    const mailerService = new EmailService();

    for (const offer of instance) {
      const student = await StudentModel.findByPk(offer.studentId);
      if (!student) {
        throw new NotFoundException(`Student not found for offer ${offer.id}`);
        continue;
      }

      const user = await UserModel.findByPk(student.userId);
      if (!user) {
        throw new NotFoundException(`User not found for student ${student.id}`);
        continue;
      }

      const dto: SendEmailDto = {
        from: { name: APP_NAME, address: MAIL_USER },
        // recepients: [{ address: DEFAULT_MAIL_TO }], // Put your email address for testing
        recepients: [{ address: user.email }],
        subject: "Test email",
        html: `<p>Hi ${user.name}, there is an offCampus Offer for you</p>`,
      };

      await mailerService.sendEmail(dto);
    }
  }
}
