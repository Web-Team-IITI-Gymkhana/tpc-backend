import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { jafModel } from "./jaf";

@Table({
  tableName: "event",
})
export class eventModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @ForeignKey(() => jafModel)
  @Column({ type: sequelize.UUID })
  jafId: typeof randomUUID;
  @BelongsTo(() => jafModel, "jafId")
  jaf: jafModel;

  @Column
  stage: string;

  @Column({ type: sequelize.DATE })
  startDateTime: Date;

  @Column({ type: sequelize.DATE })
  endDateTime: Date;
}
