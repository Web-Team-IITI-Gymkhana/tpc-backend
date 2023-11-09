import { randomUUID } from "crypto";
import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table, Unique } from "sequelize-typescript";
import { Company } from "./company";
import { Season } from "./season";
import { Student } from "./student";

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
  id: typeof randomUUID;

  @Unique("StudentSeasonCompanyUnique")
  @ForeignKey(() => Student)
  @Column(sequelize.UUID)
  studentId: typeof randomUUID;
  @BelongsTo(() => Student, "studentId")
  student: Student;

  @Unique("StudentSeasonCompanyUnique")
  @ForeignKey(() => Season)
  @Column(sequelize.UUID)
  seasonId: typeof randomUUID;
  @BelongsTo(() => Season, "seasonId")
  season: Season;

  @Unique("StudentSeasonCompanyUnique")
  @ForeignKey(() => Company)
  @Column(sequelize.UUID)
  companyId: typeof randomUUID;
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
