import sequelize, { Sequelize } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
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
    allowNull: false,
  })
  studentId: string;

  @BelongsTo(() => StudentModel, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
  })
  student: StudentModel;

  @Column({
    type: sequelize.STRING,
  })
  filepath?: string;

  @Column({ type: sequelize.BOOLEAN, defaultValue: false, allowNull: false })
  verified: boolean;
}
