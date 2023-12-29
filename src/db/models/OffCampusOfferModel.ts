import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table, Unique } from "sequelize-typescript";
import { CompanyModel } from "./CompanyModel";
import { SeasonModel } from "./SeasonModel";
import { StudentModel } from "./StudentModel";

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

  @Unique("StudentSeasonCompanyUnique")
  @ForeignKey(() => StudentModel)
  @Column(sequelize.UUID)
  studentId: string;

  @Unique("StudentSeasonCompanyUnique")
  @ForeignKey(() => SeasonModel)
  @Column(sequelize.UUID)
  seasonId: string;

  // Delete Off Campus Offer onDelete of Season
  @BelongsTo(() => SeasonModel, {
    foreignKey: "seasonId",
    onDelete: "CASCADE",
  })
  season: SeasonModel;

  @Unique("StudentSeasonCompanyUnique")
  @ForeignKey(() => CompanyModel)
  @Column(sequelize.UUID)
  companyId: string;

  // Restrict Delete Off Campus Offer onDelete of Company
  @BelongsTo(() => CompanyModel, {
    foreignKey: "companyId",
    onDelete: "RESTRICT",
  })
  company: CompanyModel;

  @Column
  salary: number;

  @Column
  salaryPeriod: number;

  @Column({
    type: sequelize.JSONB,
    defaultValue: sequelize.Sequelize.literal("'{}'::jsonb"),
  })
  metadata: object;

  @Column
  offerType: string;

  @Column
  status: string;
}
