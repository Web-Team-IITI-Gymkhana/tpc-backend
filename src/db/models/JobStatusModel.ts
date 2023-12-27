import sequelize from "sequelize";
import { Column, ForeignKey, Model, Table, DataType } from "sequelize-typescript";
import { JobModel } from "./JobModel";

@Table({
  tableName: "JobStatus",
})
export class JobStatusModel extends Model<JobStatusModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @ForeignKey(() => JobModel)
  @Column({ allowNull: false, type: DataType.UUID })
  jobId: string;

  @Column({
    allowNull: false,
    type: sequelize.STRING,
  })
  status: string;

  @Column({ allowNull: true, type: DataType.STRING })
  transition?: string;

  @Column({ allowNull: true, type: DataType.STRING })
  message: string;
}
