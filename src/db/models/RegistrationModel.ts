import sequelize from "sequelize";
import { Table, Model, Column, ForeignKey, BelongsTo, Unique } from "sequelize-typescript";
import { StudentModel } from "./StudentModel";
import { SeasonModel } from "./SeasonModel";

@Table({
  tableName: "Registrations",
})
export class RegistrationModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Unique("Season-Student-Unique")
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  @ForeignKey(() => StudentModel)
  studentId: string;

  @BelongsTo(() => StudentModel, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
  })
  student: StudentModel;

  @Unique("Season-Student-Unique")
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  @ForeignKey(() => SeasonModel)
  seasonId: string;

  @BelongsTo(() => SeasonModel, {
    foreignKey: "seasonId",
    onDelete: "CASCADE",
  })
  season: SeasonModel;

  @Column({
    type: sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  registered: boolean;
}
