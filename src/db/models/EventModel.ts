import { Table, Column, Model, ForeignKey, Unique, DataType, BelongsTo, HasMany } from "sequelize-typescript";
import sequelize, { Sequelize } from "sequelize";
import { JobModel } from "./JobModel";
import { EventTypeEnum } from "../../enums";
import { ApplicationModel } from "./ApplicationModel";

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

  @BelongsTo(() => JobModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  job: JobModel;

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

  @Column({ type: sequelize.BOOLEAN, allowNull: false, defaultValue: false })
  visibleToRecruiter: boolean;

  @HasMany(() => ApplicationModel, {
    foreignKey: "eventId",
    onDelete: "RESTRICT",
  })
  applications: ApplicationModel[];
}
