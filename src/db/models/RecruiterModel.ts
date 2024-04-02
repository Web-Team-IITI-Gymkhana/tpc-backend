import { Table, Column, Model, ForeignKey, BelongsTo, Unique } from "sequelize-typescript";
import sequelize from "sequelize";

import { UserModel } from "./UserModel";
import { CompanyModel } from "./CompanyModel";

@Table({
  tableName: "Recruiter",
})
export class RecruiterModel extends Model<RecruiterModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Unique("UserCompany")
  @ForeignKey(() => UserModel)
  @Column({
    unique: true,
    allowNull: false,
    type: sequelize.UUID,
  })
  userId: string;

  // Delete Recruiter onDelete of User
  @BelongsTo(() => UserModel, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  })
  user: UserModel;

  @Unique("UserCompany")
  @ForeignKey(() => CompanyModel)
  @Column({
    allowNull: false,
    type: sequelize.UUID,
  })
  companyId: string;

  // Delete Recruiter onDelete of Company
  @BelongsTo(() => CompanyModel, {
    foreignKey: "companyId",
    onDelete: "CASCADE",
  })
  company: CompanyModel;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  designation: string;

  @Column({
    type: sequelize.STRING,
  })
  landline: string;
}
