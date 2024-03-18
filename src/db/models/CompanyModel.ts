import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import sequelize, { Sequelize } from "sequelize";
import { CompanyCategory } from "../enums";
import { JobModel } from "./JobModel";
import IndustryDomain from "../enums/industryDomains.enum";

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

  @Column
  website: string;

  @Column({
    type: sequelize.ARRAY(sequelize.ENUM(...Object.values(IndustryDomain))),
  })
  domains: IndustryDomain[];

  @Column({
    type: sequelize.ENUM,
    values: Object.values(CompanyCategory),
  })
  category: CompanyCategory;

  @Column({
    type: sequelize.JSONB,
    defaultValue: Sequelize.literal("'{}'::jsonb"),
  })
  address: object;

  @Column({
    type: sequelize.INTEGER,
  })
  size: number;

  @Column({
    type: sequelize.INTEGER,
  })
  yearOfEstablishment: number;

  @Column({
    type: sequelize.STRING,
  })
  annualTurnover: string;

  @Column({
    type: sequelize.STRING,
  })
  socialMediaLink: string;

  @HasMany(() => JobModel, {
    foreignKey: "companyId",
    onDelete: "CASCADE",
  })
  jobs: JobModel[];
}
