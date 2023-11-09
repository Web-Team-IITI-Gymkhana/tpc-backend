import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { Member } from "./member";
import { Company } from "./company";

@Table({
  tableName: "Recruiter",
})
export class Recruiter extends Model {
  @ForeignKey(() => Member)
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
  })
  memberId: typeof randomUUID;
  @BelongsTo(() => Member, "memberId")
  member: Member;

  @ForeignKey(() => Company)
  @Column({
    allowNull: false,
    type: sequelize.UUID,
  })
  companyId: typeof randomUUID;
  @BelongsTo(() => Company, "companyId")
  company: Company;
}
