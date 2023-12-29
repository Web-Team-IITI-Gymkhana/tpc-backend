import { Model, Column, Table, ForeignKey, Unique } from "sequelize-typescript";
import sequelize from "sequelize";

import { StudentModel } from "./StudentModel";
import { SalaryModel } from "./SalaryModel";

@Table({
  tableName: "OnCampusOffer",
})
export class OnCampusOfferModel extends Model<OnCampusOfferModel> {
  @Column({
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Unique("StudentJobSalaryUnique")
  @ForeignKey(() => StudentModel)
  @Column({
    type: sequelize.UUID,
  })
  studentId: string;

  @Unique("StudentJobSalaryUnique")
  @ForeignKey(() => SalaryModel)
  @Column({
    type: sequelize.UUID,
  })
  salaryId: string;

  @Column
  status: string;
}
