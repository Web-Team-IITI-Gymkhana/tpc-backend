import { Table, Column, Model, Unique, HasMany } from "sequelize-typescript";
import sequelize from "sequelize";
import { SeasonTypeEnum } from "src/enums";
import { JobModel } from "./JobModel";
import { RegistrationModel } from "./RegistrationModel";

@Table({
  tableName: "Season",
})
export class SeasonModel extends Model<SeasonModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Unique("Type-Year-Unique")
  @Column({ allowNull: false })
  year: string;

  @Unique("Type-Year-Unique")
  @Column({
    type: sequelize.ENUM(...Object.values(SeasonTypeEnum)),
    allowNull: false,
  })
  type: SeasonTypeEnum;

  @HasMany(() => JobModel, {
    foreignKey: "seasonId",
  })
  jobs: JobModel[];

  @HasMany(() => RegistrationModel, {
    foreignKey: "seasonId",
  })
  registrations: RegistrationModel[];
}
