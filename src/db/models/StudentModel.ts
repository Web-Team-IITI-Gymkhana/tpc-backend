import { ForeignKey, Column, BelongsTo, Table, Model, HasMany, Unique } from "sequelize-typescript";
import sequelize from "sequelize";
import { UserModel } from "./UserModel";
import { PenaltyModel } from "./PenaltyModel";
import { ProgramModel } from "./ProgramModel";
import { OffCampusOfferModel } from "./OffCampusOfferModel";
import { ResumeModel } from "./ResumeModel";
import { OnCampusOfferModel } from "./OnCampusOfferModel";

@Table({
  tableName: "Student",
})
export class StudentModel extends Model<StudentModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Unique("UserRollNo")
  @ForeignKey(() => UserModel)
  @Column({
    type: sequelize.UUID,
    unique: true,
    allowNull: false,
  })
  userId: string;

  // Delete Student onDelete of User
  @BelongsTo(() => UserModel, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  })
  user: UserModel;

  @Unique("UserRollNo")
  @Column
  rollNo: string;

  @Column
  category: string;

  @Column({
    type: sequelize.STRING,
  })
  gender: string;

  @ForeignKey(() => ProgramModel)
  @Column({
    type: sequelize.UUID,
  })
  programId: string;

  // Delete Student onDelete of Program
  @BelongsTo(() => ProgramModel, {
    foreignKey: "programId",
    onDelete: "CASCADE",
  })
  program: ProgramModel;

  // Delete Penalty onDelete of Student
  @HasMany(() => PenaltyModel, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
  })
  penalties: PenaltyModel[];

  // Delete Off Campus Offers onDelete of Student
  @HasMany(() => OffCampusOfferModel, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
  })
  offCampusOffers: OffCampusOfferModel[];

  // Delete On Campus Offers onDelete of Student
  @HasMany(() => OnCampusOfferModel, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
  })
  onCampusOffers: OnCampusOfferModel[];

  // Delete Resume onDelete of Student
  @HasMany(() => ResumeModel, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
  })
  resumes: ResumeModel[];
}
