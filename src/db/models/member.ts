import { Table, Column, Model, IsEmail, HasOne, HasMany } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { FacultyCoordinator } from "./facultyCoordinator";
import { FacultyCoordinatorApproval } from "./facultyCoordinatorApproval";
import { TpcCoordinator } from "./tpcCoordinator";
import { Jaf } from "./jaf";
import { Student } from "./student";
import { Role } from "../enums/role.enum";
import { Recruiter } from "./recruiter";

@Table({
  tableName: "Member",
})
export class Member extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @IsEmail
  @Column({
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    allowNull: false,
  })
  name: string;

  @Column
  contact: string;

  @Column({
    allowNull: false,
    type: sequelize.ENUM,
    values: Object.values(Role),
  })
  role: Role;

  @HasOne(() => FacultyCoordinator, "memberId")
  facultyCoordinator: FacultyCoordinator;

  @HasMany(() => FacultyCoordinatorApproval, "facultyId")
  facultyCoordinatorApproval: FacultyCoordinatorApproval[];

  @HasMany(() => TpcCoordinator, "memberId")
  tpcCoordinator: TpcCoordinator[];

  @HasMany(() => Jaf, "recruiterId")
  jafs: Jaf[];

  @HasOne(() => Student, "memberId")
  student: Student;

  @HasOne(() => Recruiter, "memberId")
  recruiter: Recruiter;
}
