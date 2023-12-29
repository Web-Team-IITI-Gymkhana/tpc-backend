import sequelize, { Sequelize } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table, HasMany, Unique, DataType, HasOne } from "sequelize-typescript";
import { CompanyModel } from "./CompanyModel";
import { EventModel } from "./EventModel";
import { SeasonModel } from "./SeasonModel";
import { RecruiterModel } from "./RecruiterModel";
import { JobStatusModel } from "./JobStatusModel";
import { SalaryModel } from "./SalaryModel";

@Table({
  tableName: "Job",
})
export class JobModel extends Model<JobModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Unique("SeasonCompanyRole")
  @ForeignKey(() => SeasonModel)
  @Column(sequelize.UUID)
  seasonId: string;

  // Delete Job onDelete of Season
  @BelongsTo(() => SeasonModel, {
    foreignKey: "seasonId",
    onDelete: "CASCADE",
  })
  season: SeasonModel;

  @ForeignKey(() => RecruiterModel)
  @Column(sequelize.UUID)
  recruiterId: string;

  @Unique("SeasonCompanyRole")
  @ForeignKey(() => CompanyModel)
  @Column(sequelize.UUID)
  companyId: string;

  // Delete Job onDelete of Company
  @BelongsTo(() => CompanyModel, {
    foreignKey: "companyId",
    onDelete: "CASCADE",
  })
  company: CompanyModel;

  // @todo: add enum for this
  @Unique("SeasonCompanyRole")
  @Column
  role: string;

  @Column({ allowNull: false, type: DataType.JSONB(), defaultValue: Sequelize.literal("'{}'::jsonb") })
  metadata: object;

  @Column({ allowNull: false, type: DataType.JSONB(), defaultValue: Sequelize.literal("'{}'::jsonb") })
  eligibility: object;

  @Column({ defaultValue: false })
  active: boolean;

  @Column({ allowNull: true, type: sequelize.UUID })
  currentStatusId: string;

  // Delete JobStatus onDelete of Job
  @HasOne(() => JobStatusModel, {
    as: "currentStatus",
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  currentStatus: JobStatusModel;

  // Delete Job Status onDelete of Job
  @HasMany(() => JobStatusModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  jobStatuses: JobStatusModel[];

  // Delete Events onDelete of Job
  @HasMany(() => EventModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  events: Event[];

  // Delete Salary onDelete of Job
  @HasMany(() => SalaryModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  salaries: SalaryModel[];
}
