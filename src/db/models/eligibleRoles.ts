import { randomUUID } from "crypto";
import sequelize from "sequelize";
import { Column, HasMany, Model, Table } from "sequelize-typescript";
import { Gender } from "../enums/student.enum";
import { RolesOffered } from "./rolesOffered";

@Table({
  tableName: "EligibleRoles",
})
export class EligibleRoles extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @Column({
    type: sequelize.ENUM,
    values: Object.values(Gender),
  })
  gender: Gender;

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

  @HasMany(() => RolesOffered, "roleId")
  rolesOffered: RolesOffered[];
}
