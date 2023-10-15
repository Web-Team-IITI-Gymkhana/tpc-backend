import { Table, Column, Model } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";

@Table({
  tableName: "company",
})
export class companyModel extends Model {
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
}
