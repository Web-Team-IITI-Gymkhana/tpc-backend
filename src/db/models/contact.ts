import { randomUUID } from 'crypto';
import sequelize from 'sequelize';
import { BelongsTo, Column, CreatedAt, ForeignKey, Model, Table, Unique, UpdatedAt } from 'sequelize-typescript';
import { companyModel } from './company';

@Table({
  tableName: 'contact',
})
export class contactModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  Contact_id: typeof randomUUID;

  @Column
  Name: string;

  @Column({
    type: 'JSONB',
    allowNull: true, // Optional - specify if the column allows null values
  })
  contact: { primary: string; secondary: string };

  @Unique
  @Column
  email: string;

  @ForeignKey(() => companyModel)
  @Column(sequelize.UUID)
  Company_id: typeof randomUUID;
  @BelongsTo(() => companyModel, 'Company_id')
  company: companyModel;

  @Column
  Role: string;
}
