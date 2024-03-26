import sequelize, { Sequelize } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table, HasMany, Unique, DataType, HasOne } from "sequelize-typescript";
import { CompanyModel } from "./CompanyModel";
import { EventModel } from "./EventModel";
import { SeasonModel } from "./SeasonModel";
import { RecruiterModel } from "./RecruiterModel";
import { JobStatusModel } from "./JobStatusModel";
import { SalaryModel } from "./SalaryModel";
import { JobCoordinatorModel } from "./JobCoordinatorModel";
import { FacultyApprovalRequestModel } from "./FacultyApprovalRequestModel";

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

  // Restrict Job Delete onDelete of Recruiter
  @BelongsTo(() => RecruiterModel, {
    foreignKey: "recruiterId",
    onDelete: "RESTRICT",
  })
  recruiter: RecruiterModel;

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

  @Column
  others: string;

  @Column({ defaultValue: false })
  active: boolean;

  @Column({ type: sequelize.STRING })
  currentStatus: string;

  @Column({
    type: sequelize.JSONB,
    defaultValue: Sequelize.literal("'{}'::jsonb"),
  })
  companyDetailsFilled: object;

  @Column({
    type: sequelize.JSONB,
    defaultValue: Sequelize.literal("'{}'::jsonb"),
  })
  recruiterDetailsFilled: object;

  @Column({
    type: sequelize.JSONB,
    defaultValue: Sequelize.literal("'{}'::jsonb"),
  })
  selectionProcedure: object;

  @Column({
    type: sequelize.STRING,
  })
  description: string;

  @Column({
    type: sequelize.STRING,
  })
  attachment: string;

  @Column({
    type: sequelize.STRING,
  })
  skills: string;

  @Column({
    type: sequelize.STRING,
  })
  location: string;

  @Column({
    type: sequelize.INTEGER,
  })
  noOfVacancies: number;

  @Column({
    type: sequelize.DATE,
  })
  offerLetterReleaseDate: string;

  @Column({
    type: sequelize.DATE,
  })
  joiningDate: string;

  @Column({
    type: sequelize.INTEGER,
  })
  duration: number;

  /*
   * //Restrict the deletion of status that is the current Status for a job.
   * @BelongsTo(() => JobStatusModel, {
   * as: "currentStatus",
   * foreignKey: "currentStatusId",
   * constraints: false,
   * })
   * currentStatus: JobStatusModel;
   */

  // Delete Job Status onDelete of Job
  @HasMany(() => JobStatusModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  jobStatuses: JobStatusModel[];

  //Delete Job onDelete of Job.
  @HasMany(() => JobCoordinatorModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  jobCoordinators: JobCoordinatorModel[];

  //Delete Faculy Approval Request on delete of Job
  @HasMany(() => FacultyApprovalRequestModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  facultyApprovalRequests: FacultyApprovalRequestModel[];

  // Delete Events onDelete of Job
  @HasMany(() => EventModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  events: EventModel[];

  // Delete Salary onDelete of Job
  @HasMany(() => SalaryModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  salaries: SalaryModel[];
}
