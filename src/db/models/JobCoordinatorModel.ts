import { Table, Column, Model, ForeignKey, Unique, BelongsTo } from "sequelize-typescript";
import sequelize from "sequelize";
import { JobModel } from "./JobModel";
import { TpcMemberModel } from "./TpcMemberModel";
import { JobCoordinatorRoleEnum } from "../../enums";

@Table({
  tableName: "JobCoordinator",
})
export class JobCoordinatorModel extends Model<JobCoordinatorModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Unique("TpcMemberJob")
  @ForeignKey(() => TpcMemberModel)
  @Column({ type: sequelize.UUID, allowNull: false })
  tpcMemberId: string;

  // Delete Job Coordinator onDelete of CAMC Member
  @BelongsTo(() => TpcMemberModel, {
    foreignKey: "tpcMemberId",
    onDelete: "CASCADE",
  })
  tpcMember: TpcMemberModel;

  @Unique("TpcMemberJob")
  @ForeignKey(() => JobModel)
  @Column({ type: sequelize.UUID, allowNull: false })
  jobId: string;

  // Delete Job Coordinator onDelete of Job
  @BelongsTo(() => JobModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  job: JobModel;

  @Column({ allowNull: false, type: sequelize.ENUM(...Object.values(JobCoordinatorRoleEnum)) })
  role: JobCoordinatorRoleEnum;
}
