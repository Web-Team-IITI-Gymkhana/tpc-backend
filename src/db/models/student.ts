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
    // defaultValue: {
    //   isRegistered: 1,
    //   isFreezed: 0,
    // },
  })
  internshipDetails: {
    SeasonID: typeof randomUUID;
    isRegistered: boolean;
    isFreezed: boolean;
    offer: typeof randomUUID;
  };

  @Column({
    type: sequelize.JSONB,
    // defaultValue: {
    //   isRegistered: 1,
    //   isFreezed: 0,
    // },
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

// Student
// email id - mil jayegi authorization
// internship_details :
// 	{
// 		Season_id, is_registered, is_freezed, offer?(single offer ids)
// 	}
// placement_details :
// 	{
// 		Season_id, is_registered, is_freezed, offers(array of offers ids)
// 	}
// Penalty_points - number
// meta_date - string
