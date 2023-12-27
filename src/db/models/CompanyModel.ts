import { Table, Column, Model, DataType } from "sequelize-typescript";
import sequelize, { Sequelize } from "sequelize";

@Table({
  tableName: "Company",
})
export class CompanyModel extends Model<CompanyModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Column({
    allowNull: false,
  })
  name: string;

  @Column({ type: DataType.JSONB, defaultValue: Sequelize.literal("'{}'::jsonb") })
  metadata: object;
}
