import { Table, Column, Model, ForeignKey, BelongsTo, HasMany, Unique, Index, DataType } from "sequelize-typescript";
import sequelize, { Sequelize } from "sequelize";
import { Rounds } from "./rounds";
import { JobModel } from "./JobModel";
import { EventType } from "../enums/eventType.enum";
import { EventStatus } from "../enums/eventStatus.enum";

@Table({
  tableName: "Event",
})
export class EventModel extends Model<EventModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Unique("JobTypeRoundNoUnique")
  @ForeignKey(() => JobModel)
  @Column({ type: sequelize.UUID })
  jobId: string;

  @Unique("JobTypeRoundNoUnique")
  @Column({ allowNull: false, type: DataType.ENUM, values: Object.values(EventType) })
  type: EventType;

  @Unique("JobTypeRoundNoUnique")
  @Column({ allowNull: false, defaultValue: 1, type: DataType.INTEGER })
  roundNumber: Number;

  @Column({ allowNull: false, type: DataType.ENUM, values: Object.values(EventStatus) })
  status: EventStatus;

  @Column({ allowNull: true, type: DataType.JSONB(), defaultValue: Sequelize.literal("'{}'::jsonb") })
  metadata: object;

  @Column({ type: sequelize.DATE })
  startDateTime: Date;

  @Column({ type: sequelize.DATE })
  endDateTime: Date;
}
