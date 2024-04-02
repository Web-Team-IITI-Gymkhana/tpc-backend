import { ForeignKey, Column, BelongsTo, Table, Model, HasMany } from "sequelize-typescript";
import sequelize from "sequelize";
import { UserModel } from "./UserModel";
import { JobModel } from "./JobModel";
import { JobCoordinatorModel } from "./JobCoordinatorModel";
import { TpcMemberRoleEnum } from "src/enums";
import { DepartmentEnum } from "src/enums/department.enum";

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

  @Column({ allowNull: false, type: sequelize.ENUM(...Object.values(DepartmentEnum)) })
  department: DepartmentEnum;

  @ForeignKey(() => UserModel)
  @Column({ type: sequelize.UUID, unique: true, allowNull: false })
  userId: string;

  // Delete TpcMember onDelete of User
  @BelongsTo(() => UserModel, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  })
  user: UserModel;

  @Column({ allowNull: false, type: sequelize.ENUM(...Object.values(TpcMemberRoleEnum)) })
  role: TpcMemberRoleEnum;

  @HasMany(() => JobCoordinatorModel, {
    foreignKey: "tpcMemberId",
    onDelete: "CASCADE",
  })
  jobCoordinators: JobCoordinatorModel[];
}
