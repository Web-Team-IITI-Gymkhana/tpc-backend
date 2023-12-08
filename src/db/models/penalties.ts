import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { Student } from "./student";

@Table({
  tableName: "Penalties",
})
export class Penalties extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @ForeignKey(() => Student)
  @Column({ type: sequelize.UUID })
  studentId: typeof randomUUID;
  @BelongsTo(() => Student, "studentId")
  student: Student;

  @Column
  penalty: number;

  @Column
  reason: string;

  @Column({ type: sequelize.DATE })
  penaltyDate: Date;
}
