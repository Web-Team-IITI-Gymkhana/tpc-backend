import { Table, Column, Model, ForeignKey, Unique, BelongsTo, AfterBulkCreate } from "sequelize-typescript";
import sequelize from "sequelize";
import { FacultyModel } from "./FacultyModel";
import { SalaryModel } from "./SalaryModel";
import { FacultyApprovalStatusEnum } from "src/enums";
import { EmailService, getHtmlContent } from "src/services/EmailService";
import { SendEmailDto } from "src/services/EmailService";
import { UserModel } from "./UserModel";
import { IEnvironmentVariables, env } from "src/config";
import { NotFoundException } from "@nestjs/common";
import { JobModel } from "./JobModel";
import { CompanyModel } from "./CompanyModel";
import path from "path";

const environmentVariables: IEnvironmentVariables = env();
const { MAIL_USER, APP_NAME, FRONTEND_URL, DEFAULT_MAIL_TO } = environmentVariables;

@Table({
  tableName: "FacultyApprovalRequest",
})
export class FacultyApprovalRequestModel extends Model<FacultyApprovalRequestModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Unique("FacultyJob")
  @ForeignKey(() => FacultyModel)
  @Column({ type: sequelize.UUID, unique: true, allowNull: false })
  facultyId: string;

  // Delete Faculty Approval Request onDelete of Faculty
  @BelongsTo(() => FacultyModel, {
    foreignKey: "facultyId",
    onDelete: "RESTRICT",
  })
  faculty: FacultyModel;

  @Unique("FacultyJob")
  @ForeignKey(() => SalaryModel)
  @Column({ type: sequelize.UUID, unique: true, allowNull: false })
  salaryId: string;

  // Delete Faculty Approval Request onDelete of Job
  @BelongsTo(() => SalaryModel, {
    foreignKey: "salaryId",
    onDelete: "CASCADE",
  })
  salary: SalaryModel;

  @Column({
    type: sequelize.ENUM(...Object.values(FacultyApprovalStatusEnum)),
    defaultValue: FacultyApprovalStatusEnum.PENDING,
    allowNull: false,
  })
  status: FacultyApprovalStatusEnum;

  @Column({
    type: sequelize.STRING,
  })
  remarks?: string;

  @AfterBulkCreate
  static async sendEmailHook(instance: FacultyApprovalRequestModel[]) {
    const mailerService = new EmailService();

    const faculties = await FacultyModel.findAll({
      where: {
        id: instance.map((approval) => approval.facultyId),
      },
      include: [
        {
          model: UserModel,
          as: "user",
        },
      ],
    });

    const salaries = await SalaryModel.findAll({
      where: {
        id: instance.map((approval) => approval.salaryId),
      },
      include: [
        {
          model: JobModel,
          as: "job",
          include: [
            {
              model: CompanyModel,
              as: "company",
            },
          ],
        },
      ],
    });

    const facultyDict = faculties.reduce((acc, faculty) => {
      acc[faculty.id] = faculty;

      return acc;
    }, {});

    const salaryDict = salaries.reduce((acc, salary) => {
      acc[salary.id] = salary;

      return acc;
    }, {});

    const approvals = instance.map((approval) => {
      return {
        ...approval,
        faculty: facultyDict[approval.facultyId],
        salary: salaryDict[approval.salaryId],
      };
    });

    const url = `${FRONTEND_URL}/faculty`;
    const templatePath = path.resolve(process.cwd(), "src/html", "ApprovalRequestToFaculty.html");

    for (const approval of approvals) {
      const replacements = {
        facultyName: approval.faculty.user.name,
        companyName: approval.salary.job.company.name,
        url: url,
      };
      const emailHtmlContent = getHtmlContent(templatePath, replacements);
      const data: SendEmailDto = {
        from: { name: APP_NAME, address: MAIL_USER },
        // recepients: [{ address: DEFAULT_MAIL_TO }],
        recepients: [{ address: approval.faculty.user.email }],
        subject: "Approval Request for Job Announcement Form",
        html: emailHtmlContent,
      };

      await mailerService.sendEmail(data);
    }
  }
}
