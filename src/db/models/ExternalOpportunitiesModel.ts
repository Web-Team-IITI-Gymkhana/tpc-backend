import sequelize, { Op, Sequelize, WhereOptions } from "sequelize";
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
  HasMany,
  Unique,
  DataType,
  HasOne,
  AfterCreate,
  AfterUpdate,
  AfterBulkUpdate,
  BeforeBulkUpdate,
} from "sequelize-typescript";
@Table({
  tableName: "ExternalOpportunities",
})
export class ExternalOpportunitiesModel extends Model<ExternalOpportunitiesModel> {
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
  company: string;

  @Column({
    type: sequelize.DATE,
    allowNull: false,
  })
  lastdate: Date;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  link: string;
}
