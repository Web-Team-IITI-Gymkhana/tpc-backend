import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import sequelize from "sequelize";
import { UserModel } from "./UserModel";

@Table({
  tableName: "Faculty",
})
export class FacultyModel extends Model<FacultyModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Column({ allowNull: false, type: sequelize.STRING })
  department: string;

  @ForeignKey(() => UserModel)
  @Column({ type: sequelize.UUID, unique: true })
  userId: string;

  // Delete Faculty onDelete of User
  @BelongsTo(() => UserModel, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  })
  user: UserModel;
}
