import { randomUUID } from 'crypto';
import sequelize from 'sequelize';
import { Column, CreatedAt, Model, Table, Unique, UpdatedAt } from 'sequelize-typescript';

@Table({
  tableName: 'student',
})
export class studentModel extends Model {
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
    type: sequelize.JSONB,
  })
  internshipDetails: {
    SeasonID: typeof randomUUID;
    isRegistered: boolean;
    isFreezed: boolean;
    offer: typeof randomUUID;
  };

  @Column({
    type: sequelize.JSONB,
  })
  placementDetails: {
    SeasonID: typeof randomUUID;
    isRegistered: boolean;
    isFreezed: boolean;
    offers: string[];
  };

  @Column({
    defaultValue: 0,
  })
  penaltyPoints: number;

  @Column
  metaData: string;

  @Column
  @CreatedAt
  createdAt: Date;

  @Column
  @UpdatedAt
  updatedAt: Date;
}
