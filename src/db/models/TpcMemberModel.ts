import { ForeignKey, Column, BelongsTo, Table, Model, HasMany } from "sequelize-typescript";
import sequelize from "sequelize";
import { UserModel } from "./UserModel";
import { JobModel } from "./JobModel";
import { JobCoordinatorModel } from "./JobCoordinatorModel";

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

  // Delete TpcMember onDelete of User
  @BelongsTo(() => UserModel, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  })
  user: UserModel;

  @Column({ allowNull: false, type: sequelize.STRING })
  role: string;

  @HasMany(() => JobCoordinatorModel, {
    foreignKey: "tpcMemberId",
    onDelete: "CASACDE",
  })
  jobCoordinators: JobCoordinatorModel[];
}
