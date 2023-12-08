import { Table, Column, Model, HasMany } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { Jaf } from "./jaf";
import { PpoOffer } from "./ppoOffer";
import { Recruiter } from "./recruiter";

@Table({
  tableName: "Company",
})
export class Company extends Model {
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
  name: string;

  @HasMany(() => Jaf, "companyId")
  jafs: Jaf[];

  @HasMany(() => PpoOffer, "companyId")
  ppoOffers: PpoOffer[];

  @HasMany(() => Recruiter, "companyId")
  recruiters: Recruiter[];
}
