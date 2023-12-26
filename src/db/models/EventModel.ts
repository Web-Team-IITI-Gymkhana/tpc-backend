import { Table, Column, Model, ForeignKey, Unique, DataType } from "sequelize-typescript";
import sequelize, { Sequelize } from "sequelize";
import { JobModel } from "./JobModel";

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
  @Column({ allowNull: false, type: sequelize.STRING })
  type: string;

  @Unique("JobTypeRoundNoUnique")
  @Column({ allowNull: false, defaultValue: 1, type: DataType.INTEGER })
  roundNumber: Number;

  @Column({ allowNull: false, type: sequelize.STRING })
  status: string;

  @Column({ allowNull: true, type: DataType.JSONB(), defaultValue: Sequelize.literal("'{}'::jsonb") })
  metadata: object;

  @Column({ type: sequelize.DATE })
  startDateTime: Date;

  @Column({ type: sequelize.DATE })
  endDateTime: Date;
}
