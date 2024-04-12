import { Table, Column, Model, ForeignKey, Unique, DataType } from "sequelize-typescript";
import sequelize, { Sequelize } from "sequelize";
import { JobModel } from "./JobModel";
import { EventTypeEnum } from "src/enums";

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

  @Unique("Job-RoundNo-Unique")
  @ForeignKey(() => JobModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  jobId: string;

  @Unique("Job-RoundNo-Unique")
  @Column({ allowNull: false, defaultValue: 1, type: DataType.INTEGER })
  roundNumber: number;

  @Column({ allowNull: false, type: sequelize.ENUM(...Object.values(EventTypeEnum)) })
  type: EventTypeEnum;

  @Column({ type: sequelize.STRING })
  metadata?: string;

  @Column({ type: sequelize.DATE, allowNull: false })
  startDateTime: Date;

  @Column({ type: sequelize.DATE, allowNull: false })
  endDateTime: Date;
}
