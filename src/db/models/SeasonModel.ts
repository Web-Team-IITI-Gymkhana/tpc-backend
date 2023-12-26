import { Table, Column, Model, Unique } from "sequelize-typescript";
import sequelize from "sequelize";

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

  @Unique("TypeYearUnique")
  @Column({ allowNull: false })
  year: string;

  @Unique("TypeYearUnique")
  @Column({
    type: sequelize.STRING,
  })
  type: string;
}
