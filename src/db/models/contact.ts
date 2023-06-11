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
  id: typeof randomUUID;

  @Column
  name: string;

  @Column({
    type: 'JSONB',
    allowNull: true,
  })
  contact: { primary: string; secondary: string };

  @Unique
  @Column
  email: string;

  @ForeignKey(() => companyModel)
  @Column(sequelize.UUID)
  companyId: typeof randomUUID;
  @BelongsTo(() => companyModel, 'companyId')
  company: companyModel;

  @Column
  role: string;
}
