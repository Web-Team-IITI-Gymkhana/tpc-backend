import { Model, Column, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { Student } from "./student";
import { Jaf } from "./jaf";

@Table({
  tableName: "OnCampusOffer",
})
export class OnCampusOffer extends Model {
  @ForeignKey(() => Student)
  @Column({
    type: sequelize.UUID,
    primaryKey: true,
  })
  studentId: typeof randomUUID;
  @BelongsTo(() => Student, "studentId")
  student: Student;

  @ForeignKey(() => Jaf)
  @Column({
    type: sequelize.UUID,
    primaryKey: true,
  })
  jafId: typeof randomUUID;
  @BelongsTo(() => Jaf, "jafId")
  jaf: Jaf;

  @Column
  status: string;
}
