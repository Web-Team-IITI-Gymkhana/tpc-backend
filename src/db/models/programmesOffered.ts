import sequelize from "sequelize";
import { Model, Table, Column, Unique, HasMany } from "sequelize-typescript";

import { RolesOffered } from "./rolesOffered";

@Table({
  tableName: "ProgrammesOffered",
})
export class ProgrammesOffered extends Model {
  @Column({
    primaryKey: true,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Unique("ProgrammeDegreeBranchYearUnique")
  @Column
  programmeDegree: string;

  @Unique("ProgrammeDegreeBranchYearUnique")
  @Column
  branch: string;

  @Unique("ProgrammeDegreeBranchYearUnique")
  @Column
  year: Date;

  @HasMany(() => RolesOffered)
  rolesOffered: RolesOffered[];
}
