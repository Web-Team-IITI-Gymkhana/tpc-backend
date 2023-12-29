import { Table, Column, Model, ForeignKey, BelongsTo, Unique } from "sequelize-typescript";
import sequelize from "sequelize";

import { EventModel } from "./EventModel";
import { StudentModel } from "./StudentModel";
import { JobModel } from "./JobModel";
import { ResumeModel } from "./ResumeModel";

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
  })
  eventId: string;

  // Restrict Delete Application onDelete of Event
  @BelongsTo(() => EventModel, {
    foreignKey: "eventId",
    onDelete: "RESTRICT",
  })
  event: EventModel;

  @Unique("JobStudentResume")
  @ForeignKey(() => JobModel)
  @Column({
    type: sequelize.UUID,
  })
  jobId: string;

  // Delete Application onDelete of Job
  @BelongsTo(() => JobModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  job: JobModel;

  @Unique("JobStudentResume")
  @ForeignKey(() => StudentModel)
  @Column({
    type: sequelize.UUID,
  })
  studentId: string;

  // Delete Application onDelete of Student
  @BelongsTo(() => StudentModel, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
  })
  student: StudentModel;

  @Column
  status: string;

  @Unique("JobStudentResume")
  @ForeignKey(() => ResumeModel)
  @Column({
    type: sequelize.UUID,
  })
  resumeId: string;

  // Restrict Resume Deletion if associated with Application
  @BelongsTo(() => ResumeModel, {
    foreignKey: "resumeId",
    onDelete: "RESTRICT",
  })
  resume: ResumeModel;
}
