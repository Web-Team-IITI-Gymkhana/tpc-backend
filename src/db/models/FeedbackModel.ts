import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import sequelize, { Sequelize } from "sequelize";
import { CompanyCategoryEnum, IndustryDomainEnum } from "src/enums";
import { JobModel } from "./JobModel";
import { StudentModel } from "./StudentModel";

@Table({
  tableName: "Feedback",
})
export class FeedbackModel extends Model<FeedbackModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @ForeignKey(() => StudentModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  studentId: string;

  @ForeignKey(() => JobModel)
  @Column({ type: sequelize.UUID, allowNull: false })
  jobId: string;

  @Column({
    type: sequelize.TEXT({ length: "long" }),
  })
  remarks?: string;

  @BelongsTo(() => JobModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  job: JobModel;
}
