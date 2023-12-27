import { ForeignKey, Column, BelongsTo, Table, Model } from "sequelize-typescript";
import sequelize from "sequelize";
import { UserModel } from "./UserModel";

@Table({
  tableName: "TpcMember",
})
export class TpcMemberModel extends Model<TpcMemberModel> {
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

  @BelongsTo(() => UserModel, "userId")
  user: UserModel;

  @Column({ allowNull: false, type: sequelize.STRING })
  role: string;
}
