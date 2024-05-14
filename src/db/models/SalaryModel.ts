import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { JobModel } from "./JobModel";
import { GenderEnum, CategoryEnum, DepartmentEnum } from "src/enums";
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
    type: sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  })
  minCPI: number;

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

  @HasMany(() => OnCampusOfferModel, {
    foreignKey: "salaryId",
    onDelete: "CASCADE",
  })
  onCampusOffers: OnCampusOfferModel[];
}
