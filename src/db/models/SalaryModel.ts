import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { JobModel } from "./JobModel";
import { GenderEnum, CategoryEnum } from "../../enums";
import { FacultyApprovalRequestModel } from "./FacultyApprovalRequestModel";

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
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  jobId: string;

  @BelongsTo(() => JobModel, {
    foreignKey: "jobId",
  })
  job: JobModel;

  @Column({
    type: sequelize.STRING,
  })
  salaryPeriod?: string;

  @Column({
    type: sequelize.STRING,
  })
  others?: string;

  @Column({
    type: sequelize.JSONB,
    defaultValue: sequelize.Sequelize.literal("'{}'::jsonb"),
    allowNull: false,
  })
  criteria: object;

  @Column({
    type: sequelize.INTEGER,
    allowNull: false,
  })
  baseSalary: number;

  @Column({
    type: sequelize.INTEGER,
    allowNull: false,
  })
  totalCTC: number;

  @Column({
    type: sequelize.INTEGER,
    allowNull: false,
  })
  takeHomeSalary: number;

  @Column({
    type: sequelize.INTEGER,
    allowNull: false,
  })
  grossSalary: number;

  @Column({
    type: sequelize.INTEGER,
    allowNull: false,
  })
  otherCompensations: number;

  @HasMany(() => FacultyApprovalRequestModel, {
    foreignKey: "salaryId",
    onDelete: "CASCADE",
  })
  facultyApprovalRequests: FacultyApprovalRequestModel[];
}
