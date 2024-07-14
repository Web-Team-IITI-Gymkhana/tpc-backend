import sequelize, { Op, Sequelize, WhereOptions } from "sequelize";
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
  HasMany,
  Unique,
  DataType,
  HasOne,
  AfterCreate,
  AfterUpdate,
  AfterBulkUpdate,
  BeforeBulkUpdate,
} from "sequelize-typescript";
import { CompanyModel } from "./CompanyModel";
import { EventModel } from "./EventModel";
import { SeasonModel } from "./SeasonModel";
import { RecruiterModel } from "./RecruiterModel";
import { SalaryModel } from "./SalaryModel";
import { JobCoordinatorModel } from "./JobCoordinatorModel";
import { FacultyApprovalRequestModel } from "./FacultyApprovalRequestModel";
import { CategoryEnum, DepartmentEnum, GenderEnum, JobStatusTypeEnum } from "src/enums";
import { ApplicationModel } from "./ApplicationModel";
import { EmailService, getHtmlContent } from "src/services/EmailService";
import { SendEmailDto } from "src/services/EmailService";
import { StudentModel } from "./StudentModel";
import { UserModel } from "./UserModel";
import { IEnvironmentVariables, env } from "src/config";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { RegistrationModel } from "./RegistrationModel";
import path from "path";

const environmentVariables: IEnvironmentVariables = env();
const { MAIL_USER, APP_NAME, FRONTEND_URL, DEFAULT_MAIL_TO } = environmentVariables;

interface IUpdateOptions {
  where: WhereOptions<JobModel>;
  attributes: {
    active: boolean;
  };
}

interface IRecruiterDetails {
  name: string;
  email: string;
}
interface ICompanyDetails {
  name: string;
}

@Table({
  tableName: "Job",
})
export class JobModel extends Model<JobModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @ForeignKey(() => SeasonModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  seasonId: string;

  // Delete Job onDelete of Season
  @BelongsTo(() => SeasonModel, {
    foreignKey: "seasonId",
    onDelete: "CASCADE",
  })
  season: SeasonModel;

  @ForeignKey(() => RecruiterModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  recruiterId: string;

  // Restrict Job Delete onDelete of Recruiter
  @BelongsTo(() => RecruiterModel, {
    foreignKey: "recruiterId",
    onDelete: "RESTRICT",
  })
  recruiter: RecruiterModel;

  @ForeignKey(() => CompanyModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  companyId: string;

  // Delete Job onDelete of Company
  @BelongsTo(() => CompanyModel, {
    foreignKey: "companyId",
    onDelete: "RESTRICT",
  })
  company: CompanyModel;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  role: string;

  @Column(sequelize.STRING)
  others?: string;

  @Column({
    type: sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  active: boolean;

  @Column({
    type: sequelize.ENUM(...Object.values(JobStatusTypeEnum)),
    allowNull: false,
    defaultValue: JobStatusTypeEnum.INITIALIZED,
  })
  currentStatus: JobStatusTypeEnum;

  @Column({
    type: sequelize.JSONB,
    defaultValue: Sequelize.literal("'{}'::jsonb"),
  })
  companyDetailsFilled: object;

  @Column({
    type: sequelize.JSONB,
    defaultValue: Sequelize.literal("'{}'::jsonb"),
  })
  recruiterDetailsFilled: object;

  @Column({
    type: sequelize.JSONB,
    defaultValue: Sequelize.literal("'{}'::jsonb"),
  })
  selectionProcedure: object;

  @Column({
    type: sequelize.STRING,
  })
  description?: string;

  @Column({
    type: sequelize.STRING,
  })
  attachment?: string;

  @Column({
    type: sequelize.STRING,
  })
  skills?: string;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  location: string;

  @Column({
    type: sequelize.INTEGER,
  })
  noOfVacancies?: number;

  @Column({
    type: sequelize.DATE,
  })
  offerLetterReleaseDate?: Date;

  @Column({
    type: sequelize.DATE,
  })
  joiningDate?: Date;

  @Column({
    type: sequelize.INTEGER,
  })
  duration?: number;

  @Column({
    type: sequelize.TEXT({ length: "long" }),
  })
  feedback?: string;

  //Delete Job Coordinators onDelete of Job.
  @HasMany(() => JobCoordinatorModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  jobCoordinators: JobCoordinatorModel[];

  // Delete Events onDelete of Job
  @HasMany(() => EventModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  events: EventModel[];

  // Delete Salary onDelete of Job
  @HasMany(() => SalaryModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  salaries: SalaryModel[];

  @HasMany(() => ApplicationModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  applications: ApplicationModel[];

  @AfterCreate
  static async sendEmailHook(instance: JobModel) {
    const mailerService = new EmailService();

    const admins = await UserModel.findAll({
      where: {
        role: "ADMIN",
      },
    });

    const emails = admins.map((admin) => ({ address: admin.email }));

    const url = `${FRONTEND_URL}/admin/jobs`;

    const adminPath = path.resolve(process.cwd(), "src/html", "JafToAdmin.html");
    const adminReplacements = {
      companyName: (instance.companyDetailsFilled as ICompanyDetails).name,
      url: url,
    };
    const adminContent = getHtmlContent(adminPath, adminReplacements);

    const recruiterPath = path.resolve(process.cwd(), "src/html", "JafToRecruiter.html");
    const recruiterReplacements = {
      recruiterName: (instance.recruiterDetailsFilled as IRecruiterDetails).name,
    };
    const recruiterContent = getHtmlContent(recruiterPath, recruiterReplacements);

    const mailToAdmin: SendEmailDto = {
      from: { name: APP_NAME, address: MAIL_USER },
      recepients: [...emails],
      // recepients: [{ address: DEFAULT_MAIL_TO }],
      subject: `Job Announcement Form Filled by ${(instance.companyDetailsFilled as ICompanyDetails).name}`,
      html: adminContent,
    };
    const mailToRecruiter: SendEmailDto = {
      from: { name: APP_NAME, address: MAIL_USER },
      recepients: [{ address: (instance.recruiterDetailsFilled as IRecruiterDetails).email }],
      // recepients: [{ address: DEFAULT_MAIL_TO }],
      subject: "Job Announcement Form Successfully Submitted",
      html: recruiterContent,
    };

    await mailerService.sendEmail(mailToAdmin);
    await mailerService.sendEmail(mailToRecruiter);
  }

  @BeforeBulkUpdate
  static async sendEmailOnEventChange(options: IUpdateOptions) {
    const jobs = await JobModel.findAll({
      where: options.where,
      include: [
        {
          model: EventModel,
          as: "events",
        },
        {
          model: CompanyModel,
          as: "company",
        },
      ],
    });

    const newActive = options.attributes.active;

    const filteredJobs = jobs.filter((job) => job.active === false && newActive === true);

    const salaries = await SalaryModel.findAll({
      where: {
        jobId: filteredJobs.map((job) => job.id),
      },
      include: [
        {
          model: JobModel,
          as: "job",
          include: [
            {
              model: SeasonModel,
              as: "season",
              required: true,
              include: [
                {
                  model: RegistrationModel,
                  as: "registrations",
                },
              ],
            },
          ],
        },
      ],
    });

    const conditions = salaries.map((salary) => ({
      cpi: { [Op.gte]: salary.minCPI },
      programId: { [Op.in]: salary.programs },
      category: { [Op.in]: salary.categories },
      gender: { [Op.in]: salary.genders },
      tenthMarks: { [Op.gte]: salary.tenthMarks },
      twelthMarks: { [Op.gte]: salary.twelthMarks },
      id: {
        [Op.in]: sequelize.literal(
          `(SELECT "studentId" FROM "Registrations" WHERE "seasonId" = '${salary.job.season.id}' AND "registered" = true)`
        ),
      },
    }));

    const students = await StudentModel.findAll({
      where: {
        [Op.or]: conditions,
      },
      include: [
        {
          model: UserModel,
          as: "user",
          required: true,
        },
      ],
    });

    const mailerService = new EmailService();

    const url = `${FRONTEND_URL}/student/job/salary/${filteredJobs[0].id}`;
    const templatePath = path.resolve(process.cwd(), "src/html", "PollForStudent.html");

    const formattedEndDateTime = filteredJobs[0].events[0].endDateTime.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });

    for (const student of students) {
      const replacements = {
        companyName: filteredJobs[0].company.name,
        role: filteredJobs[0].role,
        studentName: student.user.name,
        deadline: formattedEndDateTime,
        url: url,
      };
      const emailHtmlContent = getHtmlContent(templatePath, replacements);
      const data: SendEmailDto = {
        from: { name: APP_NAME, address: MAIL_USER },
        recepients: [{ address: DEFAULT_MAIL_TO }],
        // recepients: [{ address: student.user.email }],
        subject: `IMP: POLL for ${filteredJobs[0].company.name} - ${filteredJobs[0].role}`,
        html: emailHtmlContent,
      };

      await mailerService.sendEmail(data);
    }
  }
}
