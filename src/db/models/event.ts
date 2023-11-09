import { Table, Column, Model, ForeignKey, BelongsTo, HasMany, Unique, Index } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { Jaf } from "./jaf";
import { Rounds } from "./rounds";

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

  @Index("Jaf-Id")
  @Unique("JafRoundNoUnique")
  @ForeignKey(() => Jaf)
  @Column({ type: sequelize.UUID })
  jafId: typeof randomUUID;
  @BelongsTo(() => Jaf, "jafId")
  jaf: Jaf;

  @Column
  stage: string;

  @Unique("JafRoundNoUnique")
  @Column
  roundNumber: Number;

  @Column({ type: sequelize.DATE })
  startDateTime: Date;

  @Column({ type: sequelize.DATE })
  endDateTime: Date;

  @HasMany(() => Rounds, "eventId")
  rounds: Rounds[];
}
