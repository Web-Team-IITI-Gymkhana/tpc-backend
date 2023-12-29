import { Table, Column, Model, ForeignKey, Unique, BelongsTo } from "sequelize-typescript";
import sequelize from "sequelize";
import { FacultyModel } from "./FacultyModel";
import { JobModel } from "./JobModel";

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
  @Column({ type: sequelize.UUID, unique: true })
  facultyId: string;

  // Delete Faculty Approval Request onDelete of Faculty
  @BelongsTo(() => FacultyModel, {
    foreignKey: "facultyId",
    onDelete: "CASCADE",
  })
  faculty: FacultyModel;

  @Unique("FacultyJob")
  @ForeignKey(() => JobModel)
  @Column({ type: sequelize.UUID, unique: true })
  jobId: string;

  // Delete Faculty Approval Request onDelete of Job
  @BelongsTo(() => JobModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  job: JobModel;

  @Column({ type: sequelize.BOOLEAN, defaultValue: false })
  approved: boolean;

  @Column
  remarks: string;
}
