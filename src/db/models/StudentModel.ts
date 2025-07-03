import { ForeignKey, Column, BelongsTo, Table, Model, HasMany, Unique, HasOne } from "sequelize-typescript";
import sequelize from "sequelize";
import { UserModel } from "./UserModel";
import { PenaltyModel } from "./PenaltyModel";
import { ProgramModel } from "./ProgramModel";
import { OffCampusOfferModel } from "./OffCampusOfferModel";
import { ResumeModel } from "./ResumeModel";
import { OnCampusOfferModel } from "./OnCampusOfferModel";
import { CategoryEnum, GenderEnum, BacklogEnum } from "../../enums";
import { RegistrationModel } from "./RegistrationModel";
import { TpcMemberModel } from "./TpcMemberModel";

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
  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  rollNo: string;

  @Column({
    type: sequelize.ENUM(...Object.values(CategoryEnum)),
    allowNull: false,
  })
  category: CategoryEnum;

  @Column({
    type: sequelize.ENUM(...Object.values(GenderEnum)),
    allowNull: false,
  })
  gender: GenderEnum;

  @Column({
    type: sequelize.FLOAT,
    allowNull: false,
  })
  cpi: number;

  @Column({
    type: sequelize.ENUM(...Object.values(BacklogEnum)),
    allowNull: true,
  })
  backlog?: BacklogEnum;

  @Column({
    type: sequelize.FLOAT,
    allowNull: true,
  })
  tenthMarks?: number;

  @Column({
    type: sequelize.FLOAT,
    allowNull: true,
  })
  twelthMarks?: number;

  @ForeignKey(() => ProgramModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
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

  @HasMany(() => RegistrationModel, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
  })
  registrations: RegistrationModel[];

  @HasOne(() => TpcMemberModel, {
    foreignKey: "studentId",
  })
  tpcMember: TpcMemberModel;
}
