import { Table, Column, Model, HasMany } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { Type } from "../enums/season.enum";
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

  @Column({ type: sequelize.DATE, allowNull: false })
  year: Date;

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
