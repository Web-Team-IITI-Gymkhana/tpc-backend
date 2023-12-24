import { Table, Column, Model, ForeignKey, BelongsTo, Index } from "sequelize-typescript";
import sequelize from "sequelize";

import { EventModel } from "./EventModel";
import { StudentModel } from "./StudentModel";

@Table({
  tableName: "Rounds",
})
export class Rounds extends Model {
  @ForeignKey(() => EventModel)
  @Column({
    type: sequelize.UUID,
    primaryKey: true,
  })
  eventId: string;
  @BelongsTo(() => EventModel, "eventId")
  event: EventModel;

  @ForeignKey(() => StudentModel)
  @Column({
    type: sequelize.UUID,
    primaryKey: true,
  })
  studentId: string;
  @BelongsTo(() => StudentModel, "studentId")
  student: StudentModel;

  @Column
  status: string;

  @Column
  companyPreference: string;
}
