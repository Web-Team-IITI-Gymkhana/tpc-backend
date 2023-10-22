import { Table, Column, Model, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { Jaf } from "./jaf";
import { Rounds } from "./rounds";
import { Stage } from "../enums/event.enum";

@Table({
  tableName: "Event",
})
export class Event extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @ForeignKey(() => Jaf)
  @Column({ type: sequelize.UUID })
  jafId: typeof randomUUID;
  @BelongsTo(() => Jaf, "jafId")
  jaf: Jaf;

  @Column({
    type: sequelize.ENUM,
    values: Object.values(Stage),
  })
  stae: Stage;

  @Column
  roundNumber: Number;

  @Column({ type: sequelize.DATE })
  startDateTime: Date;

  @Column({ type: sequelize.DATE })
  endDateTime: Date;

  @HasMany(() => Rounds, "eventId")
  rounds: Rounds[];
}
