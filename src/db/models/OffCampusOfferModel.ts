import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table, Unique } from "sequelize-typescript";
import { CompanyModel } from "./CompanyModel";
import { SeasonModel } from "./SeasonModel";
import { StudentModel } from "./StudentModel";
import { OfferStatusEnum } from "src/enums";

@Table({
  tableName: "OffCampusOffer",
})
export class OffCampusOfferModel extends Model<OffCampusOfferModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Unique("Student-Season-CompanyUnique")
  @ForeignKey(() => StudentModel)
  @Column({ type: sequelize.UUID, allowNull: false })
  studentId: string;

  // Delete Off Campus Offer onDelete of Student
  @BelongsTo(() => StudentModel, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
  })
  student: StudentModel;

  @Unique("Student-Season-CompanyUnique")
  @ForeignKey(() => SeasonModel)
  @Column({ type: sequelize.UUID, allowNull: false })
  seasonId: string;

  // Delete Off Campus Offer onDelete of Season
  @BelongsTo(() => SeasonModel, {
    foreignKey: "seasonId",
    onDelete: "CASCADE",
  })
  season: SeasonModel;

  @Unique("Student-Season-CompanyUnique")
  @ForeignKey(() => CompanyModel)
  @Column({ type: sequelize.UUID, allowNull: false })
  companyId: string;

  // Restrict Delete Off Campus Offer onDelete of Company
  @BelongsTo(() => CompanyModel, {
    foreignKey: "companyId",
    onDelete: "RESTRICT",
  })
  company: CompanyModel;

  @Column({
    type: sequelize.FLOAT,
    allowNull: false,
  })
  salary: number;

  @Column({
    type: sequelize.STRING,
  })
  salaryPeriod?: string;

  @Column({
    type: sequelize.STRING,
  })
  metadata?: string;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  role: string;

  //@todo make enum of this.
  @Column({
    type: sequelize.ENUM(...Object.values(OfferStatusEnum)),
    allowNull: false,
    defaultValue: OfferStatusEnum.ONGOING,
  })
  status: OfferStatusEnum;
}
