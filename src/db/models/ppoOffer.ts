import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table, Unique } from "sequelize-typescript";
import { CompanyModel as Company } from "./CompanyModel";
import { SeasonModel as Season } from "./SeasonModel";
import { StudentModel } from "./StudentModel";

@Table({
  tableName: "PpoOffer",
})
export class PpoOffer extends Model {
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
  @BelongsTo(() => StudentModel, "studentId")
  student: StudentModel;

  @Unique("StudentSeasonCompanyUnique")
  @ForeignKey(() => Season)
  @Column(sequelize.UUID)
  seasonId: string;
  @BelongsTo(() => Season, "seasonId")
  season: Season;

  @Unique("StudentSeasonCompanyUnique")
  @ForeignKey(() => Company)
  @Column(sequelize.UUID)
  companyId: string;
  @BelongsTo(() => Company, "companyId")
  company: Company;

  @Column
  salaryValue: number;

  @Column
  salaryPeriod: number;

  @Column
  metadata: string;

  @Column
  offerType: string;

  @Column
  status: string;
}
