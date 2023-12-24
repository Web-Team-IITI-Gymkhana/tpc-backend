import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table, Unique } from "sequelize-typescript";
import { JobModel } from "./JobModel";
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
  id: string;

  @Unique("ProgramJaf")
  @ForeignKey(() => ProgrammesOffered)
  @Column(sequelize.UUID)
  programId: string;
  @BelongsTo(() => ProgrammesOffered, "programId")
  programmesOffered: ProgrammesOffered;

  @Unique("ProgramJaf")
  @ForeignKey(() => JobModel)
  @Column(sequelize.UUID)
  jobId: string;
  @BelongsTo(() => JobModel, "jobId")
  job: JobModel;

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
