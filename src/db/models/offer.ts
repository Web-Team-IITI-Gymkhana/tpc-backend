import { randomUUID } from 'crypto';
import sequelize from 'sequelize';
import { Column, CreatedAt, Model, Table, Unique, UpdatedAt } from 'sequelize-typescript';
import { Types } from './job.enum';

@Table({
  tableName: 'offer',
})
export class offerModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @Column({ defaultValue: true })
  onCampus: boolean;

  @Column
  companyName: string;

  @Column({ defaultValue: true })
  is_ppo: boolean;

  @Column
  role: string;

  @Column({
    type: sequelize.ENUM,
    values: Object.values(Types),
  })
  type: Types;

  @Column({ defaultValue: false })
  core: boolean;

  @Column({
    type: sequelize.JSONB,
    defaultValue: {
      CTC_1_yr: 0,
      CTC_4_yr: 0,
      stipend: null,
    },
  })
  salary: {
    CTC_1_yr: number;
    CTC_4_yr: number;
    stipend: number | null;
  };

  @Column({ defaultValue: '' })
  metaData: string;
}

// Oncampus vs offcampus
// Company’s name
// Is_ppo - boolean
// Role
// Type(Full time/internship)
// Core vs Non-core
// Salary - object(Postgres me JSONB) ->
// Eg. { CTC_1_yr ?:  , CTC_4_yr ?: , stipend?:  }
// { CTC 1st year (or Stipend in case of internship) CTC 4 years (null in case of internship }
// Meta_data - string
