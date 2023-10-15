import { randomUUID } from "crypto";
import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { memberModel } from "./member";
import { jafModel } from "./jaf";

@Table({
  tableName: "tpcCoordinator",
})
export class tpcCoordinatorModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @ForeignKey(() => memberModel)
  @Column(sequelize.UUID)
  memberId: typeof randomUUID;
  @BelongsTo(() => memberModel, "memberId")
  member: memberModel;

  @ForeignKey(() => jafModel)
  @Column(sequelize.UUID)
  jafId: typeof randomUUID;
  @BelongsTo(() => jafModel, "jafId")
  jaf: jafModel;

  @Column({ defaultValue: true })
  primaryCoordinator: boolean;
}
