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

  @BelongsTo(() => EventModel, "eventId")
  event: EventModel;

  @Unique("JobStudentResume")
  @ForeignKey(() => JobModel)
  @Column({
    type: sequelize.UUID,
  })
  jobId: string;

  @BelongsTo(() => JobModel, "jobId")
  job: JobModel;

  @Unique("JobStudentResume")
  @ForeignKey(() => StudentModel)
  @Column({
    type: sequelize.UUID,
  })
  studentId: string;

  @BelongsTo(() => StudentModel, "studentId")
  student: StudentModel;

  @Column
  status: string;

  @Unique("JobStudentResume")
  @ForeignKey(() => ResumeModel)
  @Column({
    type: sequelize.UUID,
  })
  resumeId: string;

  @BelongsTo(() => ResumeModel, "resumeId")
  resume: ResumeModel;
}
