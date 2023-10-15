import { Table, Column, Model, IsEmail, ForeignKey, BelongsTo } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { companyModel } from "./company";

@Table({
  tableName: "member",
})
export class memberModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @IsEmail
  @Column({
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    allowNull: false,
  })
  name: string;

  @Column
  contact: string;

  @Column({
    allowNull: false,
  })
  role: string;

  @ForeignKey(() => companyModel)
  @Column({ type: sequelize.UUID })
  companyId: typeof randomUUID;
  @BelongsTo(() => companyModel, "companyId")
  company: companyModel;
}
