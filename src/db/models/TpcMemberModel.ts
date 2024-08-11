import { ForeignKey, Column, BelongsTo, Table, Model, HasMany } from "sequelize-typescript";
import sequelize from "sequelize";
import { UserModel } from "./UserModel";
import { JobCoordinatorModel } from "./JobCoordinatorModel";
import { TpcMemberRoleEnum, DepartmentEnum } from "src/enums";
import { StudentModel } from "./StudentModel";

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

  @ForeignKey(() => StudentModel)
  @Column({ type: sequelize.UUID, unique: true, allowNull: false })
  studentId: string;

  @BelongsTo(() => StudentModel, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
  })
  student: StudentModel;

  @Column({ allowNull: false, type: sequelize.ENUM(...Object.values(TpcMemberRoleEnum)) })
  role: TpcMemberRoleEnum;

  @HasMany(() => JobCoordinatorModel, {
    foreignKey: "tpcMemberId",
    onDelete: "CASCADE",
  })
  jobCoordinators: JobCoordinatorModel[];
}
