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
  isPpo: boolean;

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

  @Column
  metaData: string;
}
