import sequelize from "sequelize";
import { AllowNull, BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { JobModel } from "./JobModel";
import { GenderEnum, CategoryEnum, DepartmentEnum, BacklogEnum } from "../../enums";
import { FacultyApprovalRequestModel } from "./FacultyApprovalRequestModel";
import { OnCampusOfferModel } from "./OnCampusOfferModel";

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
    type: sequelize.ARRAY(sequelize.UUID),
  })
  programs?: string[];

  @Column({
    type: sequelize.ARRAY(sequelize.ENUM(...Object.values(GenderEnum))),
  })
  genders?: GenderEnum[];

  @Column({
    type: sequelize.ARRAY(sequelize.ENUM(...Object.values(CategoryEnum))),
  })
  categories?: CategoryEnum[];

  @Column({
    type: sequelize.ARRAY(sequelize.ENUM(...Object.values(DepartmentEnum))),
  })
  departments?: DepartmentEnum[];

  @Column({
    type: sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  })
  minCPI: number;

  @Column({
    type: sequelize.ENUM(...Object.values(BacklogEnum)),
  })
  isBacklogAllowed?: BacklogEnum;

  @Column({
    type: sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  })
  tenthMarks: number;

  @Column({
    type: sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  })
  twelthMarks: number;

  @Column({
    type: sequelize.ARRAY(sequelize.ENUM(...Object.values(DepartmentEnum))),
    allowNull: false,
    defaultValue: [],
  })
  facultyApprovals?: DepartmentEnum[];

  // SALARY FOR FTE JAF

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  totalCTC: number;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  foreignCurrencyCTC?: number;

  @Column({
    type: sequelize.STRING(3),
    allowNull: true,
    defaultValue: "USD",
  })
  foreignCurrencyCode?: string;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  grossSalary: number;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  takeHomeSalary: number;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  baseSalary: number;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  joiningBonus?: number;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  performanceBonus?: number;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  relocation?: number;

  @Column({
    type: sequelize.STRING,
    allowNull: true,
  })
  bondDuration: string;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  bondAmount?: number;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  esopAmount?: number;

  @Column({
    type: sequelize.STRING,
    allowNull: true,
  })
  esopVestPeriod: string;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  firstYearCTC?: number;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  medicalAllowance?: number;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  retentionBonus?: number;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  deductions?: number;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  otherCompensations: number;

  // SALARY FOR INTERN JAF

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  stipend?: number;

  @Column({
    type: sequelize.STRING,
    allowNull: true,
  })
  foreignCurrencyStipend?: string;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  accomodation?: number;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  tenetativeCTC?: number;

  @Column({
    type: sequelize.DATE,
    allowNull: true,
  })
  PPOConfirmationDate?: Date;

  @HasMany(() => FacultyApprovalRequestModel, {
    foreignKey: "salaryId",
    onDelete: "CASCADE",
  })
  facultyApprovalRequests: FacultyApprovalRequestModel[];

  @HasMany(() => OnCampusOfferModel, {
    foreignKey: "salaryId",
    onDelete: "CASCADE",
  })
  onCampusOffers: OnCampusOfferModel[];
}
