import { randomUUID } from "crypto";
import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { companyModel } from "./company";
import { seasonModel } from "./season";
import { studentModel } from "./student";

@Table({
  tableName: "ppoOffer",
})
export class ppOfferModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @ForeignKey(() => studentModel)
  @Column(sequelize.UUID)
  studentId: typeof randomUUID;
  @BelongsTo(() => studentModel, "studentId")
  student: studentModel;

  @ForeignKey(() => seasonModel)
  @Column(sequelize.UUID)
  seasonId: typeof randomUUID;
  @BelongsTo(() => seasonModel, "seasonId")
  season: seasonModel;

  @ForeignKey(() => companyModel)
  @Column(sequelize.UUID)
  companyId: typeof randomUUID;
  @BelongsTo(() => companyModel, "companyId")
  company: companyModel;

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
