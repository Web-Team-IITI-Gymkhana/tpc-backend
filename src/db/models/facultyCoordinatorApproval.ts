import { randomUUID } from "crypto";
import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { FacultyCoordinator } from "./facultyCoordinator";
import { Jaf } from "./jaf";

@Table({
  tableName: "FacultyCoordinatorApproval",
})
export class FacultyCoordinatorApproval extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @ForeignKey(() => Jaf)
  @Column(sequelize.UUID)
  jafId: typeof randomUUID;
  @BelongsTo(() => Jaf, "jafId")
  jaf: Jaf;

  @ForeignKey(() => FacultyCoordinator)
  @Column(sequelize.UUID)
  facultyCoordinatorId: typeof randomUUID;
  @BelongsTo(() => FacultyCoordinator, "facultyCoordinatorId")
  facultyCoordinator: FacultyCoordinator;

  @Column
  approval: boolean;

  @Column
  remarks: string;
}
