import { randomUUID } from "crypto";
import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Member } from "./member";
import { Jaf } from "./jaf";

@Table({
  tableName: "TpcCoordinator",
})
export class TpcCoordinator extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @ForeignKey(() => Member)
  @Column(sequelize.UUID)
  memberId: typeof randomUUID;
  @BelongsTo(() => Member, "memberId")
  member: Member;

  @ForeignKey(() => Jaf)
  @Column(sequelize.UUID)
  jafId: typeof randomUUID;
  @BelongsTo(() => Jaf, "jafId")
  jaf: Jaf;

  @Column({ defaultValue: true })
  primaryCoordinator: boolean;
}
