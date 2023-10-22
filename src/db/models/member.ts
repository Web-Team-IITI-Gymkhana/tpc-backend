import { Table, Column, Model, IsEmail, ForeignKey, BelongsTo, HasOne, HasMany } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { Company } from "./company";
import { FacultyCoordinator } from "./facultyCoordinator";
import { TpcCoordinator } from "./tpcCoordinator";
import { Season } from "./season";
import { Jaf } from "./jaf";
import { Student } from "./student";

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
  })
  role: string;

  @ForeignKey(() => Company)
  @Column({ type: sequelize.UUID })
  companyId: typeof randomUUID;
  @BelongsTo(() => Company, "companyId")
  company: Company;

  @HasOne(() => FacultyCoordinator, "memberId")
  facultyCoordinator: FacultyCoordinator;

  @HasOne(() => Season, "memberId")
  season: Season;

  @HasMany(() => TpcCoordinator, "memberId")
  tpcCoordinator: TpcCoordinator[];

  @HasMany(() => Jaf, "recruiterId")
  jafs: Jaf[];

  @HasOne(() => Student, "memberId")
  student: Student;
}
