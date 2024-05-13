/* eslint-disable no-console */
import { Table, Column, Model, ForeignKey, BelongsTo, Unique, AfterUpdate } from "sequelize-typescript";
import sequelize from "sequelize";

import { EventModel } from "./EventModel";
import { StudentModel } from "./StudentModel";
import { JobModel } from "./JobModel";
import { ResumeModel } from "./ResumeModel";
import { MailerService } from "src/mailer/mailer.service";
import { SendEmailDto } from "../../mailer/mail.interface";
import { UserModel } from "./UserModel";

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

  @AfterUpdate
  static async sendEmailOnEventChange(instance: ApplicationModel) {
    // Check if the eventId has been modified
    if (instance.previous("eventId") !== instance.eventId) {
      const mailerService = new MailerService();

      // Retrieve the associated student details
      const student = await StudentModel.findByPk(instance.studentId);
      if (!student) {
        console.error(`Student not found for offer ${instance.id}`);
      }

      // Find the user associated with this student
      const user = await UserModel.findByPk(student.userId);
      if (!user) {
        console.error(`User not found for student ${student.id}`);
      }

      // Prepare the email data
      const dto: SendEmailDto = {
        from: { name: "TPC Portal", address: "aryangkulkarni@gmail.com" },
        // recepients: [{ address: "me210003016@iiti.ac.in" }],
        recepients: [{ address: user.email }],
        subject: "Event Change Notification",
        html: `Dear ${user.name},\nThe event associated with your application ID ${instance.id} has been changed.`,
      };

      // Send email
      await mailerService.sendEmail(dto);
    }
  }
}
