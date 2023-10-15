import { randomUUID } from "crypto";
import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { companyModel } from "./company";
import { memberModel } from "./member";
import { seasonModel } from "./season";

@Table({
  tableName: "jaf",
})
export class jafModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @ForeignKey(() => seasonModel)
  @Column(sequelize.UUID)
  seasonId: typeof randomUUID;
  @BelongsTo(() => seasonModel, "seasonId")
  season: seasonModel;

  @ForeignKey(() => memberModel)
  @Column(sequelize.UUID)
  recruiterId: typeof randomUUID;
  @BelongsTo(() => memberModel, "memberId")
  member: memberModel;

  @ForeignKey(() => companyModel)
  @Column(sequelize.UUID)
  companyId: typeof randomUUID;
  @BelongsTo(() => companyModel, "companyId")
  company: companyModel;

  @Column
  role: string;

  @Column
  metadata: string;

  @Column
  docs: string;

  @Column
  accepted: boolean;

  @Column
  publicAccess: boolean;

  @Column
  eligibility: string;
}
