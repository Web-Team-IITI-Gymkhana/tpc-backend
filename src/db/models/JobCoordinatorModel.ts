import { Table, Column, Model, IsEmail, ForeignKey, BelongsTo, HasMany, Index, Unique } from "sequelize-typescript";
import sequelize from "sequelize";
import { UserModel } from "./UserModel";
import { JobModel } from "./JobModel";

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

  @Unique("UserJob")
  @ForeignKey(() => UserModel)
  @Column({ type: sequelize.UUID })
  userId: string;

  @Unique("UserJob")
  @ForeignKey(() => JobModel)
  @Column({ type: sequelize.UUID })
  jobId: string;

  @Column({ allowNull: false, type: sequelize.STRING })
  role: string;
}
