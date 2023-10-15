import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { Event } from "./event";
import { Student } from "./student";

@Table({
  tableName: "Rounds",
})
export class Rounds extends Model {
  @ForeignKey(() => Event)
  @Column({
    type: sequelize.UUID,
    primaryKey: true,
  })
  eventId: typeof randomUUID;
  @BelongsTo(() => Event, "eventId")
  event: Event;

  @ForeignKey(() => Student)
  @Column({
    type: sequelize.UUID,
    primaryKey: true,
  })
  studentId: typeof randomUUID;
  @BelongsTo(() => Student, "studentId")
  student: Student;

  @Column
  status: string;

  @Column
  companyPreference: string;
}
