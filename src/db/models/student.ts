import { ForeignKey, Column, BelongsTo, Table, Model } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { memberModel } from "./member";
import { gender } from "../enums/student.enum";

@Table({
  tableName: "student",
})
export class studentModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @ForeignKey(() => memberModel)
  @Column({ type: sequelize.UUID, unique: true })
  memberId: typeof randomUUID;
  @BelongsTo(() => memberModel, "memberId")
  member: memberModel;

  @Column({ allowNull: false })
  name: string;

  @Column
  category: string;

  @Column({
    type: sequelize.ENUM,
    values: Object.values(gender),
  })
  gender: gender;

  @Column({ allowNull: false })
  branch: string;

  @Column({ type: sequelize.DATE, allowNull: false })
  graduationYear: Date;

  @Column
  currentCPI: Number;

  @Column
  resume: string;

  @Column({ defaultValue: 0 })
  totalPenalty: Number;
}
