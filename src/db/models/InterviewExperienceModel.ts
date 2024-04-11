import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { CompanyModel } from "./CompanyModel";
import { StudentModel } from "./StudentModel";

@Table({
  tableName: "InterviewExperiences",
})
export class InterviewExperienceModel extends Model {
  @Column({
    type: sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  studentName: string;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  year: string;

  @ForeignKey(() => CompanyModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  companyId: string;

  @BelongsTo(() => CompanyModel, {
    foreignKey: "companyId",
    onDelete: "RESTRICT",
  })
  company: CompanyModel;

  @ForeignKey(() => StudentModel)
  @Column({ type: sequelize.UUID })
  studentId: string;

  @BelongsTo(() => StudentModel, {
    foreignKey: "studentId",
    onDelete: "SET NULL",
  })
  student: StudentModel;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  filename: string;
}
