/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
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
import sequelize from "sequelize";

import { EventModel } from "./EventModel";
import { StudentModel } from "./StudentModel";
import { JobModel } from "./JobModel";
import { ResumeModel } from "./ResumeModel";
import { EmailService } from "src/services/EmailService";
import { SendEmailDto } from "src/services/EmailService";
import { UserModel } from "./UserModel";
import { IEnvironmentVariables, env } from "src/config";

const environmentVariables: IEnvironmentVariables = env();
const { MAIL_USER, APP_NAME, DEFAULT_MAIL_TO } = environmentVariables;

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
    console.log("New entry created");
    const mailerService = new EmailService();
    const student = await StudentModel.findByPk(instance.studentId);
    const user = await UserModel.findByPk(student.userId);

    const dto: SendEmailDto = {
      from: { name: APP_NAME, address: MAIL_USER },
      // recepients: [{ address: DEFAULT_MAIL_TO }], // Put your email address for testing
      recepients: [{ address: `${user.email}` }], // Put your email address for testing
      subject: "Test email",
      html: `<p>Dear ${user.name}, Your Application was submitted successfully</p>`,
    };

    // Send email
    await mailerService.sendEmail(dto);
  }

  @BeforeBulkUpdate
  static async sendEmailOnEventChange(options: any) {
    const applications = await ApplicationModel.findAll({ where: options.where });

    console.log("Before Update called");
    console.log(applications);
    for (const application of applications) {
      const previousEventId = application.eventId;
      const newEventId = options.attributes.eventId;

      console.log(previousEventId);
      console.log(newEventId);

      if (previousEventId !== newEventId) {
        const mailerService = new EmailService();

        // Retrieve the associated student details
        const student = await StudentModel.findByPk(application.studentId);
        if (!student) {
          console.error(`Student not found for offer ${application.id}`);
        }

        // Find the user associated with this student
        const user = await UserModel.findByPk(student.userId);
        if (!user) {
          console.error(`User not found for student ${student.id}`);
        }

        // Prepare the email data
        const data: SendEmailDto = {
          from: { name: APP_NAME, address: MAIL_USER },
          // recepients: [{ address: DEFAULT_MAIL_TO }], // Put your email address for testing
          recepients: [{ address: user.email }],
          subject: "Event Change Notification",
          html: `Dear ${user.name},\nThe event associated with your application ID ${application.id} has been changed.`,
        };

        // Send email
        await mailerService.sendEmail(data);
      }
    }
  }
}
