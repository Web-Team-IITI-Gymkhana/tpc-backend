import { ForeignKey, Column, BelongsTo, Table, Model, HasMany, Unique } from "sequelize-typescript";
import sequelize from "sequelize";

import { UserModel } from "./UserModel";
import { Gender } from "../enums/gender.enum";

@Table({
  tableName: "Student",
})
export class StudentModel extends Model<StudentModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Unique("UserRollNo")
  @ForeignKey(() => UserModel)
  @Column({
    type: sequelize.UUID,
    unique: true,
    primaryKey: true,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => UserModel, "userId")
  user: UserModel;

  @Unique("UserRollNo")
  @Column
  rollNo: string;

  @Column
  category: string;

  @Column({
    type: sequelize.ENUM,
    values: Object.values(Gender),
  })
  gender: Gender;

  @Column({ allowNull: false })
  branch: string;

  @Column({ allowNull: false })
  course: string;

  @Column({ allowNull: false })
  graduationYear: string;
}
