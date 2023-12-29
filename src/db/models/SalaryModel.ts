import sequelize from "sequelize";
import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { JobModel } from "./JobModel";

@Table({
  tableName: "Salary",
})
export class SalaryModel extends Model<SalaryModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @ForeignKey(() => JobModel)
  @Column(sequelize.UUID)
  jobId: string;

  @Column
  salaryPeriod: number;

  @Column
  salary: number;

  @Column({
    type: sequelize.JSONB,
    defaultValue: sequelize.Sequelize.literal("'{}'::jsonb"),
  })
  constraints: object;

  @Column({
    type: sequelize.JSONB,
    defaultValue: sequelize.Sequelize.literal("'{}'::jsonb"),
  })
  metadata: object;
}
