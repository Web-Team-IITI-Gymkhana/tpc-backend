import { ForeignKey, Column, BelongsTo, Table, Model, HasMany } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { Member } from "./member";
import { Gender } from "../enums/gender.enum";
import { OnCampusOffer } from "./onCampusOffer";
import { Rounds } from "./rounds";
import { Penalties } from "./penalties";
import { PpoOffer } from "./ppoOffer";

@Table({
  tableName: "Student",
})
export class Student extends Model {
  @ForeignKey(() => Member)
  @Column({
    type: sequelize.UUID,
    unique: true,
    primaryKey: true,
    allowNull: false,
  })
  memberId: typeof randomUUID;
  @BelongsTo(() => Member, "memberId")
  member: Member;

  @Column({ allowNull: false })
  name: string;

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

  @Column({ type: sequelize.DATE, allowNull: false })
  graduationYear: Date;

  @Column
  currentCPI: Number;

  @Column
  resume: string;

  @Column({ defaultValue: 0 })
  totalPenalty: Number;

  @HasMany(() => Rounds, "studentId")
  rounds: Rounds[];

  @HasMany(() => OnCampusOffer, "studentId")
  oncampusoffers: OnCampusOffer[];

  @HasMany(() => Penalties, "studentId")
  penalties: Penalties[];

  @HasMany(() => PpoOffer, "studentId")
  ppoOffers: PpoOffer[];
}
