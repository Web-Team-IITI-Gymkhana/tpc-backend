import { Table, Column, Model, IsEmail, Unique } from "sequelize-typescript";
import sequelize from "sequelize";

@Table({
  tableName: "User",
})
export class UserModel extends Model<UserModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @IsEmail
  @Unique("EmailRole")
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

  @Unique("EmailRole")
  @Column({
    allowNull: false,
    type: sequelize.STRING,
  })
  role: string;
}
