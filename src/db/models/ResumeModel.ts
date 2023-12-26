import sequelize, { Sequelize } from "sequelize";
import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { StudentModel } from "./StudentModel";

@Table({
  tableName: "Resume",
})
export class ResumeModel extends Model<ResumeModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @ForeignKey(() => StudentModel)
  @Column({
    type: sequelize.UUID,
  })
  studentId: string;

  @Column({
    type: sequelize.JSONB,
    defaultValue: Sequelize.literal("'{}'::jsonb"),
  })
  metadata: object;

  @Column({ type: sequelize.BOOLEAN, defaultValue: false })
  verified: boolean;
}
