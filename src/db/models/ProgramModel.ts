import sequelize from "sequelize";
import { Model, Table, Column, Unique } from "sequelize-typescript";
import { DepartmentEnum } from "src/enums";

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

  @Unique("Course-Branch-Year-Unique")
  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  course: string;

  @Unique("Course-Branch-Year-Unique")
  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  branch: string;

  @Column({
    type: sequelize.ENUM(...Object.values(DepartmentEnum)),
    allowNull: false,
  })
  department: DepartmentEnum;

  @Unique("Course-Branch-Year-Unique")
  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  year: string;
}
