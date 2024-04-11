import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import sequelize from "sequelize";

import { StudentModel } from "./StudentModel";

@Table({
  tableName: "Penalty",
})
export class PenaltyModel extends Model<PenaltyModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @ForeignKey(() => StudentModel)
  @Column({ type: sequelize.UUID, allowNull: false })
  studentId: string;

  @BelongsTo(() => StudentModel, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
  })
  student: StudentModel;

  @Column({
    type: sequelize.INTEGER,
    allowNull: false,
  })
  penalty: number;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  reason: string;
}
