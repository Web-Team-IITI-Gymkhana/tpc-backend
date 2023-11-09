import { Table, Column, Model, IsEmail, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { Member } from "./member";

@Table({
  tableName: "FacultyCoordinator",
})
export class FacultyCoordinator extends Model {
  @Column({
    primaryKey: true,
  })
  department: string;

  @ForeignKey(() => Member)
  @Column({ type: sequelize.UUID, unique: true })
  memberId: typeof randomUUID;
  @BelongsTo(() => Member, "memberId")
  member: Member;
}
