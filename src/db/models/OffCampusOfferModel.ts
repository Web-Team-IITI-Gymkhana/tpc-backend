import sequelize from "sequelize";
import { Column, ForeignKey, Model, Table, Unique } from "sequelize-typescript";
import { CompanyModel as Company } from "./CompanyModel";
import { SeasonModel as Season } from "./SeasonModel";
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
  @ForeignKey(() => Season)
  @Column(sequelize.UUID)
  seasonId: string;

  @Unique("StudentSeasonCompanyUnique")
  @ForeignKey(() => Company)
  @Column(sequelize.UUID)
  companyId: string;

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
