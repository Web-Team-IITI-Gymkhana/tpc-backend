import { Model, Column, Table, ForeignKey, BelongsTo, Unique } from "sequelize-typescript";
import sequelize from "sequelize";

import { StudentModel } from "./StudentModel";
import { JobModel } from "./JobModel";

@Table({
  tableName: "OnCampusOffer",
})
export class OnCampusOffer extends Model {
  @Column({
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Unique("StudentJafUnique")
  @ForeignKey(() => StudentModel)
  @Column({
    type: sequelize.UUID,
  })
  studentId: string;
  @BelongsTo(() => StudentModel, "studentId")
  student: StudentModel;

  @Unique("StudentJafUnique")
  @ForeignKey(() => JobModel)
  @Column({
    type: sequelize.UUID,
  })
  jobId: string;
  @BelongsTo(() => JobModel, "jobId")
  job: JobModel;

  @Column
  status: string;
}
