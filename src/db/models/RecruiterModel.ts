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
    type: sequelize.UUID,
  })
  userId: string;

  @BelongsTo(() => UserModel, "userId")
  user: UserModel;

  @Unique("UserCompany")
  @ForeignKey(() => CompanyModel)
  @Column({
    allowNull: false,
    type: sequelize.UUID,
  })
  companyId: string;

  @BelongsTo(() => CompanyModel, "companyId")
  company: CompanyModel;
}
