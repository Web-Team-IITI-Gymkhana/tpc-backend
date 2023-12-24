import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import sequelize from "sequelize";

import { StudentModel } from "./StudentModel";

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
  id: string;

  @ForeignKey(() => StudentModel)
  @Column({ type: sequelize.UUID })
  studentId: string;
  @BelongsTo(() => StudentModel, "studentId")
  student: StudentModel;

  @Column
  penalty: number;

  @Column
  reason: string;

  @Column({ type: sequelize.DATE })
  penaltyDate: Date;
}
