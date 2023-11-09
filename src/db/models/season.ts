import { Table, Column, Model, HasMany, Unique } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { Type } from "../enums/type.enum";
import { Jaf } from "./jaf";
import { PpoOffer } from "./ppoOffer";

@Table({
  tableName: "Season",
})
export class Season extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @Unique("TypeYearUnique")
  @Column({ type: sequelize.DATE, allowNull: false })
  year: Date;

  @Unique("TypeYearUnique")
  @Column({
    type: sequelize.ENUM,
    values: Object.values(Type),
  })
  type: Type;

  @HasMany(() => Jaf, "seasonId")
  jafs: Jaf[];

  @HasMany(() => PpoOffer, "seasonId")
  ppooffers: PpoOffer[];
}
