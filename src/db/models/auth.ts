import { randomUUID } from 'crypto';
import sequelize from 'sequelize';
import { Column, CreatedAt, Model, Table, Unique, UpdatedAt } from 'sequelize-typescript';
import { Role } from './auth.enum';

@Table({
  tableName: 'auth',
})
export class authModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @Unique
  @Column
  email: string;

  @Column({
    type: sequelize.ENUM,
    values: Object.values(Role),
    defaultValue: Role.MEMBER,
  })
  role: Role;
}
