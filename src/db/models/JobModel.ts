import sequelize, { Sequelize } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table, HasMany, Unique, DataType, HasOne } from "sequelize-typescript";
import { CompanyModel } from "./CompanyModel";
import { EventModel } from "./EventModel";
import { SeasonModel } from "./SeasonModel";
import { RecruiterModel } from "./RecruiterModel";
import { JobStatusModel } from "./JobStatusModel";

@Table({
  tableName: "Job",
})
export class JobModel extends Model<JobModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Unique("SeasonCompanyRole")
  @ForeignKey(() => SeasonModel)
  @Column(sequelize.UUID)
  seasonId: string;

  @BelongsTo(() => SeasonModel, "seasonId")
  season: SeasonModel;

  @ForeignKey(() => RecruiterModel)
  @Column(sequelize.UUID)
  recruiterId: string;

  @Unique("SeasonCompanyRole")
  @ForeignKey(() => CompanyModel)
  @Column(sequelize.UUID)
  companyId: string;

  @BelongsTo(() => CompanyModel, "companyId")
  company: CompanyModel;

  // @todo: add enum for this
  @Unique("SeasonCompanyRole")
  @Column
  role: string;

  @Column({ allowNull: true, type: DataType.JSONB(), defaultValue: Sequelize.literal("'{}'::jsonb") })
  metadata: object;

  @Column({ defaultValue: false })
  active: boolean;

  @Column({ allowNull: true, type: sequelize.UUID })
  currentStatusId: string;

  @HasOne(() => JobStatusModel, {
    as: "currentStatus",
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  currentStatus: JobStatusModel;

  @HasMany(() => EventModel, "jobId")
  events: Event[];
}
