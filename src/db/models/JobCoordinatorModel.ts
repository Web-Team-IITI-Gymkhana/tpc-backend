import { Table, Column, Model, IsEmail, ForeignKey, BelongsTo, HasMany, Index, Unique } from "sequelize-typescript";
import sequelize from "sequelize";
import { JobModel } from "./JobModel";
import { TpcMemberModel } from "./TpcMemberModel";

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
  @Column({ type: sequelize.UUID })
  tpcMemberId: string;

  @Unique("TpcMemberJob")
  @ForeignKey(() => JobModel)
  @Column({ type: sequelize.UUID })
  jobId: string;

  @Column({ allowNull: false, type: sequelize.STRING })
  role: string;
}
