import { randomUUID } from "crypto";
import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Jaf } from "./jaf";
import { EligibleRoles } from "./eligibleRoles";

@Table({
  tableName: "RolesOffered",
})
export class RolesOffered extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @ForeignKey(() => EligibleRoles)
  @Column(sequelize.UUID)
  roleId: typeof randomUUID;
  @BelongsTo(() => EligibleRoles, "roleId")
  eligiibleRoles: EligibleRoles;

  @ForeignKey(() => Jaf)
  @Column(sequelize.UUID)
  jafId: typeof randomUUID;
  @BelongsTo(() => Jaf, "jafId")
  jaf: Jaf;

  @Column
  salaryPeriod: number;

  @Column
  salary: number;
}
