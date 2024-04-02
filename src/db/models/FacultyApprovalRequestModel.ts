import { Table, Column, Model, ForeignKey, Unique, BelongsTo } from "sequelize-typescript";
import sequelize from "sequelize";
import { FacultyModel } from "./FacultyModel";
import { JobModel } from "./JobModel";
import { SalaryModel } from "./SalaryModel";

@Table({
  tableName: "FacultyApprovalRequest",
})
export class FacultyApprovalRequestModel extends Model<FacultyApprovalRequestModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Unique("FacultyJob")
  @ForeignKey(() => FacultyModel)
  @Column({ type: sequelize.UUID, unique: true, allowNull: false })
  facultyId: string;

  // Delete Faculty Approval Request onDelete of Faculty
  @BelongsTo(() => FacultyModel, {
    foreignKey: "facultyId",
    onDelete: "CASCADE",
  })
  faculty: FacultyModel;

  @Unique("FacultyJob")
  @ForeignKey(() => SalaryModel)
  @Column({ type: sequelize.UUID, unique: true, allowNull: false })
  salaryId: string;

  // Delete Faculty Approval Request onDelete of Job
  @BelongsTo(() => SalaryModel, {
    foreignKey: "salaryId",
    onDelete: "CASCADE",
  })
  salary: SalaryModel;

  @Column({ type: sequelize.BOOLEAN, defaultValue: false, allowNull: false })
  approved: boolean;

  @Column({
    type: sequelize.STRING,
  })
  remarks?: string;
}
