import { Model, Column, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import sequelize from "sequelize";
import { randomUUID } from "crypto";
import { studentModel } from "./student";
import { jafModel } from "./jaf";

@Table({
  tableName: "onCampusOffer",
})
export class onCampusOfferModel extends Model {
  @ForeignKey(() => studentModel)
  @Column({
    type: sequelize.UUID,
    primaryKey: true,
  })
  studentId: typeof randomUUID;
  @BelongsTo(() => studentModel, "studentId")
  student: studentModel;

  @ForeignKey(() => jafModel)
  @Column({
    type: sequelize.UUID,
    primaryKey: true,
  })
  jafId: typeof randomUUID;
  @BelongsTo(() => jafModel, "jafId")
  jaf: jafModel;

  @Column
  status: string;
}
