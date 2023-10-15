import { randomUUID } from "crypto";
import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { jafModel } from "./jaf";
import { eligibleRolesModel } from "./eligibleRoles";

@Table({
  tableName: "rolesOffered",
})
export class rolesOfferedModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @ForeignKey(() => eligibleRolesModel)
  @Column(sequelize.UUID)
  roleId: typeof randomUUID;
  @BelongsTo(() => eligibleRolesModel, "roleId")
  eligiibleRoles: eligibleRolesModel;

  @ForeignKey(() => jafModel)
  @Column(sequelize.UUID)
  jafId: typeof randomUUID;
  @BelongsTo(() => jafModel, "jafId")
  jaf: jafModel;

  @Column
  salaryPeriod: number;

  @Column
  salary: number;
}
