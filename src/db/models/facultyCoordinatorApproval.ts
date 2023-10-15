import { randomUUID } from "crypto";
import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { facultyCoordinatorModel } from "./facultyCoordinator";
import { jafModel } from "./jaf";

@Table({
  tableName: "facultyCoordinatorApproval",
})
export class facultyCoordinatorApprovalModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @ForeignKey(() => jafModel)
  @Column(sequelize.UUID)
  jafId: typeof randomUUID;
  @BelongsTo(() => jafModel, "jafId")
  jaf: jafModel;

  @ForeignKey(() => facultyCoordinatorModel)
  @Column(sequelize.UUID)
  facultyCoordinatorId: typeof randomUUID;
  @BelongsTo(() => facultyCoordinatorModel, "facultyCoordinatorId")
  facultyCoordinator: facultyCoordinatorModel;

  @Column
  approval: boolean;

  @Column
  remarks: string;
}
