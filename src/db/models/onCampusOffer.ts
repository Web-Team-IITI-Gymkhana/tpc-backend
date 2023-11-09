import { Model, Column, Table, ForeignKey, BelongsTo, Unique } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { Student } from "./student";
import { Jaf } from "./jaf";

@Table({
  tableName: "OnCampusOffer",
})
export class OnCampusOffer extends Model {
  @Column({
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: typeof randomUUID;

  @Unique("StudentJafUnique")
  @ForeignKey(() => Student)
  @Column({
    type: sequelize.UUID,
  })
  studentId: typeof randomUUID;
  @BelongsTo(() => Student, "studentId")
  student: Student;

  @Unique("StudentJafUnique")
  @ForeignKey(() => Jaf)
  @Column({
    type: sequelize.UUID,
  })
  jafId: typeof randomUUID;
  @BelongsTo(() => Jaf, "jafId")
  jaf: Jaf;

  @Column
  status: string;
}
