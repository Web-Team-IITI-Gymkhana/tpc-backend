import sequelize from "sequelize";
import { Model, Table, Column, Unique } from "sequelize-typescript";

@Table({
  tableName: "Program",
})
export class ProgramModel extends Model<ProgramModel> {
  @Column({
    primaryKey: true,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Unique("CoursBranchYearUnique")
  @Column
  course: string;

  @Unique("CoursBranchYearUnique")
  @Column
  branch: string;

  @Unique("CoursBranchYearUnique")
  @Column
  year: string;
}
