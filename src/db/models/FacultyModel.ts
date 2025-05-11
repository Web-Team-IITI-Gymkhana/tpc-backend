import { Table, Column, Model, ForeignKey, BelongsTo, Unique, HasMany } from "sequelize-typescript";
import sequelize from "sequelize";
import { UserModel } from "./UserModel";
import { DepartmentEnum } from "../../enums";
import { FacultyApprovalRequestModel } from "./FacultyApprovalRequestModel";

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

  @Unique("Department-Unique")
  @Column({ allowNull: false, type: sequelize.ENUM(...Object.values(DepartmentEnum)) })
  department: DepartmentEnum;

  @ForeignKey(() => UserModel)
  @Column({ type: sequelize.UUID, unique: true, allowNull: false })
  userId: string;

  // Delete Faculty onDelete of User
  @BelongsTo(() => UserModel, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  })
  user: UserModel;

  @HasMany(() => FacultyApprovalRequestModel, {
    foreignKey: "facultyId",
    onDelete: "RESTRICT",
  })
  facultyApprovalRequests: FacultyApprovalRequestModel[];
}
