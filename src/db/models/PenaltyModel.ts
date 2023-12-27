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
  @Column({ type: sequelize.UUID })
  studentId: string;

  @Column
  penalty: number;

  @Column
  reason: string;
}
