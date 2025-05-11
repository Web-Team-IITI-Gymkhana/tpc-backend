import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import sequelize, { Sequelize } from "sequelize";
import { CompanyCategoryEnum, IndustryDomainEnum } from "../../enums";
import { JobModel } from "./JobModel";

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
    type: sequelize.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: sequelize.STRING,
  })
  website?: string;

  @Column({
    type: sequelize.ARRAY(sequelize.ENUM(...Object.values(IndustryDomainEnum))),
    allowNull: false,
    defaultValue: [],
  })
  domains?: IndustryDomainEnum[];

  @Column({
    type: sequelize.ENUM,
    values: Object.values(CompanyCategoryEnum),
    allowNull: false,
  })
  category: CompanyCategoryEnum;

  @Column({
    type: sequelize.JSONB,
    defaultValue: Sequelize.literal("'{}'::jsonb"),
    allowNull: false,
  })
  address: object;

  @Column({
    type: sequelize.INTEGER,
  })
  size?: number;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  yearOfEstablishment: string;

  @Column({
    type: sequelize.STRING,
  })
  annualTurnover?: string;

  @Column({
    type: sequelize.STRING,
  })
  socialMediaLink?: string;

  @HasMany(() => JobModel, {
    foreignKey: "companyId",
    onDelete: "CASCADE",
  })
  jobs: JobModel[];
}
