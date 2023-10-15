import { Table, Column, Model } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { type } from "../enums/season.enum";

@Table({
  tableName: "season",
})
export class seasonModel extends Model {
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
    values: Object.values(type),
  })
  type: type;
}
