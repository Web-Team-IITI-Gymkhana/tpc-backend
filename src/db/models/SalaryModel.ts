import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { JobModel } from "./JobModel";
import { Gender, Category } from "../enums"; 

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
  salaryPeriod: string;

  @Column
  others: string;

  @Column({
    type: sequelize.JSONB,
    defaultValue: sequelize.Sequelize.literal("'{}'::jsonb"),
  })
  criteria: object;

  @Column({
    type: sequelize.INTEGER
  })
  baseSalary: number;

  @Column({
    type: sequelize.INTEGER
  })
  totalCTC: number;

  @Column({
    type: sequelize.INTEGER
  })
  takeHomeSalary: number;

  @Column({
    type: sequelize.INTEGER
  })
  grossSalary: number;

  @Column({
    type: sequelize.INTEGER
  })
  otherCompensations: number;
}
