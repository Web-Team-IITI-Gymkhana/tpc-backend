import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import sequelize from "sequelize";
import { CompanyModel } from "./CompanyModel";
import { RecruiterModel } from "./RecruiterModel";
import { SeasonModel } from "./SeasonModel";

@Table({
  tableName: "CompanyFeedback",
})
export class CompanyFeedbackModel extends Model<CompanyFeedbackModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @ForeignKey(() => RecruiterModel)
  @Column({
    allowNull: false,
    type: sequelize.UUID,
  })
  recruiterId: string;

  @BelongsTo(() => RecruiterModel)
  recruiter: RecruiterModel;

  @ForeignKey(() => CompanyModel)
  @Column({
    allowNull: false,
    type: sequelize.UUID,
  })
  companyId: string;

  @BelongsTo(() => CompanyModel)
  company: CompanyModel;

  @ForeignKey(() => SeasonModel)
  @Column({
    allowNull: false,
    type: sequelize.UUID,
  })
  seasonId: string;

  @BelongsTo(() => SeasonModel)
  season: SeasonModel;


  @Column(sequelize.INTEGER)
  communicationPromptness: number;

  @Column(sequelize.INTEGER)
  queryHandling: number;

  @Column(sequelize.INTEGER)
  logisticsArrangement: number;

  @Column(sequelize.INTEGER)
  studentFamiliarity: number;

  @Column(sequelize.INTEGER)
  studentCommunication: number;

  @Column(sequelize.INTEGER)
  resumeQuality: number;

  @Column(sequelize.INTEGER)
  studentPreparedness: number;

  @Column(sequelize.INTEGER)
  disciplineAndPunctuality: number;

  @Column(sequelize.STRING)
  rightTimeToContact: string;

  @Column(sequelize.TEXT)
  recommendations: string;
}
