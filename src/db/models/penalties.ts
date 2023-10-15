import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { studentModel } from "./student";

@Table({
  tableName: "penalties",
})
export class penaltiesModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @ForeignKey(() => studentModel)
  @Column({ type: sequelize.UUID })
  studentId: typeof randomUUID;
  @BelongsTo(() => studentModel, "studentId")
  student: studentModel;

  @Column
  penalty: number;

  @Column
  reason: string;

  @Column({ type: sequelize.DATE })
  penaltyDate: Date;
}
