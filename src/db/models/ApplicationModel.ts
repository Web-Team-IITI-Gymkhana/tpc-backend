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
import { EmailService } from "src/services/EmailService";
import { SendEmailDto } from "src/services/EmailService";
import { UserModel } from "./UserModel";
import { IEnvironmentVariables, env } from "src/config";
import { NotFoundException } from "@nestjs/common";
import { Op } from "sequelize";

const environmentVariables: IEnvironmentVariables = env();
const { MAIL_USER, APP_NAME, DEFAULT_MAIL_TO } = environmentVariables;

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
    const mailerService = new EmailService();

    const student = await StudentModel.findByPk(instance.studentId, {
      include: [
        {
          model: UserModel,
          as: "user",
        },
      ],
    });

    const dto: SendEmailDto = {
      from: { name: APP_NAME, address: MAIL_USER },
      // recepients: [{ address: DEFAULT_MAIL_TO }],
      recepients: [{ address: `${student.user.email}` }],
      subject: "Test email",
      html: `<p>Dear ${student.user.name}, Your Application was submitted successfully</p>`,
    };

    await mailerService.sendEmail(dto);
  }

  @BeforeBulkUpdate
  static async sendEmailOnEventChange(options: IUpdateOptions) {
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

    const mailerService = new EmailService();

    for (const student of students) {
      const data: SendEmailDto = {
        from: { name: APP_NAME, address: MAIL_USER },
        // recepients: [{ address: DEFAULT_MAIL_TO }],
        recepients: [{ address: student.user.email }],
        subject: "Event Change Notification",
        html: `Dear ${student.user.name},\nThe event associated with your application ID has been changed.`,
      };

      await mailerService.sendEmail(data);
    }
  }
}
