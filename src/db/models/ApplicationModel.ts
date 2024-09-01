import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  Unique,
  AfterUpdate,
  BeforeBulkUpdate,
  AfterCreate,
} from "sequelize-typescript";
import sequelize, { WhereOptions } from "sequelize";

import { EventModel } from "./EventModel";
import { StudentModel } from "./StudentModel";
import { JobModel } from "./JobModel";
import { ResumeModel } from "./ResumeModel";
import { EmailService, getHtmlContent } from "src/services/EmailService";
import { SendEmailDto } from "src/services/EmailService";
import { UserModel } from "./UserModel";
import { IEnvironmentVariables, env } from "src/config";
import { NotFoundException } from "@nestjs/common";
import { Op } from "sequelize";
import { SalaryModel } from "./SalaryModel";
import { CompanyModel } from "./CompanyModel";
import path from "path";

const environmentVariables: IEnvironmentVariables = env();
const { MAIL_USER, APP_NAME, FRONTEND_URL, DEFAULT_MAIL_TO, SEND_MAIL } = environmentVariables;

interface IUpdateOptions {
  where: WhereOptions<ApplicationModel>;
  attributes: {
    eventId: string;
  };
}

@Table({
  tableName: "Application",
})
export class ApplicationModel extends Model<ApplicationModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @ForeignKey(() => EventModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  eventId: string;

  // Restrict Delete Application onDelete of Event
  @BelongsTo(() => EventModel, {
    foreignKey: "eventId",
    onDelete: "RESTRICT",
  })
  event: EventModel;

  @Unique("Job-Student-Unique")
  @ForeignKey(() => JobModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  jobId: string;

  // Delete Application onDelete of Job
  @BelongsTo(() => JobModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  job: JobModel;

  @Unique("Job-Student-Unique")
  @ForeignKey(() => StudentModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  studentId: string;

  // Delete Application onDelete of Student
  @BelongsTo(() => StudentModel, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
  })
  student: StudentModel;

  @ForeignKey(() => ResumeModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  resumeId: string;

  // Restrict Resume Deletion if associated with Application
  @BelongsTo(() => ResumeModel, {
    foreignKey: "resumeId",
    onDelete: "RESTRICT",
  })
  resume: ResumeModel;

  @AfterCreate
  static async sendEmailHook(instance: ApplicationModel) {
    if (SEND_MAIL == "FALSE") return;
    const mailerService = new EmailService();

    const student = await StudentModel.findByPk(instance.studentId, {
      include: [
        {
          model: UserModel,
          as: "user",
        },
      ],
    });

    const job = await JobModel.findByPk(instance.jobId, {
      include: [
        {
          model: CompanyModel,
          as: "company",
        },
      ],
    });

    const templatePath = path.resolve(process.cwd(), "src/html", "ApplicationToStudent.html");
    const replacements = {
      studentName: student.user.name,
      companyName: job.company.name,
      role: job.role,
    };
    const emailHtmlContent = getHtmlContent(templatePath, replacements);

    const dto: SendEmailDto = {
      from: { name: APP_NAME, address: MAIL_USER },
      // recepients: [{ address: DEFAULT_MAIL_TO }],
      recepients: [{ address: `${student.user.email}` }],
      subject: "Job Application Successfully Submitted",
      html: emailHtmlContent,
    };

    await mailerService.sendEmail(dto);
  }

  @BeforeBulkUpdate
  static async sendEmailOnEventChange(options: IUpdateOptions) {
    if (SEND_MAIL == "FALSE") return;
    if (options.attributes.eventId === undefined) return;
    const applications = await ApplicationModel.findAll({ where: options.where });

    const newEventId = options.attributes.eventId;

    const filteredApplications = applications.filter((application) => application.eventId !== newEventId);

    const students = await StudentModel.findAll({
      where: {
        id: filteredApplications.map((application) => application.studentId),
      },
      include: [
        {
          model: UserModel,
          as: "user",
          required: true,
        },
      ],
    });

    const jobs = await JobModel.findAll({
      where: {
        id: filteredApplications.map((application) => application.jobId),
      },
      include: [
        {
          model: CompanyModel,
          as: "company",
        },
      ],
    });

    const studentDict = students.reduce((acc, student) => {
      acc[student.id] = student;

      return acc;
    }, {});

    const jobDict = jobs.reduce((acc, job) => {
      acc[job.id] = job;

      return acc;
    }, {});

    const applicationarray = filteredApplications.map((application) => {
      return {
        ...application,
        student: studentDict[application.studentId],
        job: jobDict[application.jobId],
      };
    });

    const mailerService = new EmailService();

    const templatePath = path.resolve(process.cwd(), "src/html", "PromotionToStudent.html");

    for (const application of applicationarray) {
      const url = `${FRONTEND_URL}/student/job/${application.job.id}`;
      const replacements = {
        companyName: application.job.company.name,
        studentName: application.student.user.name,
        url: url,
        role: application.job.role,
      };
      const emailHtmlContent = getHtmlContent(templatePath, replacements);
      const data: SendEmailDto = {
        from: { name: APP_NAME, address: MAIL_USER },
        // recepients: [{ address: DEFAULT_MAIL_TO }],
        recepients: [{ address: application.student.user.email }],
        subject: `Advancement to Next Round with ${application.job.company.name}`,
        html: emailHtmlContent,
      };

      await mailerService.sendEmail(data);
    }
  }
}
