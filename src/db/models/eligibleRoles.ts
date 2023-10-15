import { randomUUID } from "crypto";
import sequelize from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";
import { gender } from "../enums/student.enum";

@Table({
  tableName: "eligibleRoles",
})
export class eligibleRolesModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @Column({
    type: sequelize.ENUM,
    values: Object.values(gender),
  })
  gender: gender;

  @Column
  programme: string;

  @Column
  branch: string;

  @Column({
    type: sequelize.DATE,
    allowNull: false,
  })
  year: Date;

  @Column
  category: string;
}
