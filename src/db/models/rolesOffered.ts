import { randomUUID } from "crypto";
import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table, Unique } from "sequelize-typescript";
import { Jaf } from "./jaf";
import { ProgrammesOffered } from "./programmesOffered";
import { Gender } from "../enums/gender.enum";

@Table({
  tableName: "RolesOffered",
})
export class RolesOffered extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @Unique("ProgramJaf")
  @ForeignKey(() => ProgrammesOffered)
  @Column(sequelize.UUID)
  programId: typeof randomUUID;
  @BelongsTo(() => ProgrammesOffered, "programId")
  programmesOffered: ProgrammesOffered;

  @Unique("ProgramJaf")
  @ForeignKey(() => Jaf)
  @Column(sequelize.UUID)
  jafId: typeof randomUUID;
  @BelongsTo(() => Jaf, "jafId")
  jaf: Jaf;

  @Column({
    type: sequelize.ENUM,
    values: Object.values(Gender),
  })
  gender: Gender;

  @Column
  category: string;

  @Column
  salaryPeriod: number;

  @Column
  salary: number;
}
