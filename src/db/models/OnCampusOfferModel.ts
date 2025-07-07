import { Model, Column, Table, ForeignKey, Unique, BelongsTo, AfterBulkCreate } from "sequelize-typescript";
import sequelize from "sequelize";
import { StudentModel } from "./StudentModel";
import { SalaryModel } from "./SalaryModel";
import { OfferStatusEnum } from "../../enums";
import { EmailService, getHtmlContent } from "src/services/EmailService";
import { SendEmailDto } from "src/services/EmailService";
import { UserModel } from "./UserModel";
import { IEnvironmentVariables, env } from "../../config";
import { NotFoundException } from "@nestjs/common";
import { JobModel } from "./JobModel";
import { CompanyModel } from "./CompanyModel";
import path from "path";

const environmentVariables: IEnvironmentVariables = env();
const { MAIL_USER, APP_NAME, FRONTEND_URL, DEFAULT_MAIL_TO, SEND_MAIL } = environmentVariables;

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

  /*
   * @AfterBulkCreate
   * static async sendEmailHook(instance: OnCampusOfferModel[]) {
   *   if (SEND_MAIL == "FALSE") return;
   *   const mailerService = new EmailService();
   */

  /*
   *   const students = await StudentModel.findAll({
   *     where: {
   *       id: instance.map((offer) => offer.studentId),
   *     },
   *     include: [
   *       {
   *         model: UserModel,
   *         as: "user",
   *       },
   *     ],
   *   });
   */

  /*
   *   const salaries = await SalaryModel.findAll({
   *     where: {
   *       id: instance.map((offer) => offer.salaryId),
   *     },
   *     include: [
   *       {
   *         model: JobModel,
   *         as: "job",
   *         include: [
   *           {
   *             model: CompanyModel,
   *             as: "company",
   *           },
   *         ],
   *       },
   *     ],
   *   });
   */

  /*
   *   const studentDict = students.reduce((acc, student) => {
   *     acc[student.id] = student;
   */

  /*
   *     return acc;
   *   }, {});
   */

  /*
   *   const salaryDict = salaries.reduce((acc, salary) => {
   *     acc[salary.id] = salary;
   */

  /*
   *     return acc;
   *   }, {});
   */

  /*
   *   const offers = instance.map((offer) => {
   *     return {
   *       ...offer,
   *       student: studentDict[offer.studentId],
   *       salary: salaryDict[offer.salaryId],
   *     };
   *   });
   */

  /*
   *   const url = `${FRONTEND_URL}/student/onCampus`;
   *   const templatePath = path.resolve(process.cwd(), "src/html", "OfferToStudent.html");
   */

  /*
   *   for (const offer of offers) {
   *     const replacements = {
   *       companyName: offer.salary.job.company.name,
   *       studentName: offer.student.user.name,
   *       role: offer.salary.job.role,
   *       url: url,
   *     };
   *     const emailHtmlContent = getHtmlContent(templatePath, replacements);
   *     const data: SendEmailDto = {
   *       from: { name: APP_NAME, address: MAIL_USER },
   *       // recepients: [{ address: DEFAULT_MAIL_TO }],
   *       recepients: [{ address: offer.student.user.email }],
   *       subject: `Job Offer from ${offer.salary.job.company.name}`,
   *       html: emailHtmlContent,
   *     };
   */

  /*
   *     await mailerService.sendEmail(data);
   *   }
   * }
   */
}
