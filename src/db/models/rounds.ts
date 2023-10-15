import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { eventModel } from "./event";
import { studentModel } from "./student";

@Table({
  tableName: "rounds",
})
export class roundsModel extends Model {
  @ForeignKey(() => eventModel)
  @Column({
    type: sequelize.UUID,
    primaryKey: true,
  })
  eventId: typeof randomUUID;
  @BelongsTo(() => eventModel, "eventId")
  event: eventModel;

  @ForeignKey(() => studentModel)
  @Column({
    type: sequelize.UUID,
    primaryKey: true,
  })
  studentId: typeof randomUUID;
  @BelongsTo(() => studentModel, "studentId")
  student: studentModel;

  @Column
  status: string;

  @Column
  companyPreference: string;
}
