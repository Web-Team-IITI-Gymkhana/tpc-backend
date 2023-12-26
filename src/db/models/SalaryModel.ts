import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table, Unique } from "sequelize-typescript";
import { JobModel } from "./JobModel";
import { Gender } from "../enums/gender.enum";
import { ProgramModel } from "./ProgramModel";

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
