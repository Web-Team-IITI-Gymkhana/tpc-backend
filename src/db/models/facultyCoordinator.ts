import { Table, Column, Model, IsEmail, ForeignKey, BelongsTo } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { memberModel } from "./member";

@Table({
  tableName: "facultyCoordinator",
})
export class facultyCoordinatorModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @Column({
    allowNull: false,
  })
  department: string;

  @IsEmail
  @Column({
    unique: true,
    allowNull: false,
  })
  email: string;

  @ForeignKey(() => memberModel)
  @Column({ type: sequelize.UUID, unique: true })
  memberId: typeof randomUUID;
  @BelongsTo(() => memberModel, "memberId")
  member: memberModel;
}
