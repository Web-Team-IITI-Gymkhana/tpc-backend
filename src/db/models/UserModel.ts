import { Table, Column, Model, IsEmail, Unique, AllowNull } from "sequelize-typescript";
import sequelize from "sequelize";
import { RoleEnum } from "src/enums";

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
  })
  email: string;

  @Column({
    allowNull: false,
  })
  name: string;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  contact: string;

  @Unique("EmailRole")
  @Column({
    allowNull: false,
    type: sequelize.ENUM(...Object.values(RoleEnum)),
  })
  role: RoleEnum;
}
