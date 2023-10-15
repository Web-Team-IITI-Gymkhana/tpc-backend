import { Table, Column, Model, IsEmail, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { Member } from "./member";
import { FacultyCoordinatorApproval } from "./facultyCoordinatorApproval";

@Table({
  tableName: "FacultyCoordinator",
})
export class FacultyCoordinator extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @Column({
    allowNull: false,
  })
  department: string;

  @IsEmail
  @Column({
    unique: true,
    allowNull: false,
  })
  email: string;

  @ForeignKey(() => Member)
  @Column({ type: sequelize.UUID, unique: true })
  memberId: typeof randomUUID;
  @BelongsTo(() => Member, "memberId")
  member: Member;

  @HasMany(() => FacultyCoordinatorApproval, "facultyCoordinatorId")
  facultyCoordinatorApprovals: FacultyCoordinatorApproval[];
}
