import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table, Unique } from "sequelize-typescript";
import { CompanyModel } from "./CompanyModel";
import { StudentModel } from "./StudentModel";
import { SeasonModel } from "./SeasonModel";

@Table({
  tableName: "InterviewExperiences",
})
export class InterviewExperienceModel extends Model<InterviewExperienceModel> {
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

  @Unique("Season-Company-Student-Unique")
  @ForeignKey(() => SeasonModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  seasonId: string;

  @BelongsTo(() => SeasonModel, {
    foreignKey: "seasonId",
    onDelete: "RESTRICT",
  })
  season: SeasonModel;

  @Unique("Season-Company-Student-Unique")
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

  @Unique("Season-Company-Student-Unique")
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
