import { randomUUID } from 'crypto';
import sequelize from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { seasonModel } from './season';
import { companyModel } from './company';
import { contactModel } from './contact';
import { Types } from './job.enum';

@Table({
  tableName: 'job',
})
export class jobModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  //
  @ForeignKey(() => seasonModel)
  @Column(sequelize.UUID)
  seasonId: string;

  @BelongsTo(() => seasonModel, 'id')
  season: seasonModel;

  //
  @ForeignKey(() => companyModel)
  @Column(sequelize.UUID)
  companyId: string;

  @BelongsTo(() => companyModel, 'id')
  company: companyModel;

  //
  //
  @ForeignKey(() => contactModel)
  @Column(sequelize.UUID)
  HR_details: string;

  @BelongsTo(() => contactModel, 'id')
  contact1: contactModel;

  //

  //
  @ForeignKey(() => contactModel)
  @Column(sequelize.UUID)
  Assignee_Id: string;

  @BelongsTo(() => contactModel, 'id')
  contact2: contactModel;

  //

  @Column(DataType.ARRAY(DataType.STRING))
  eligibility_ids: string[];

  @Column({
    type: sequelize.ENUM,
    values: Object.values(Types),
  })
  type: Types;

  @Column
  role: string;

  @Column
  descriptionOfRole: string;

  @Column
  filledJafLink: string;

  @Column
  jd: string;

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

  @Column({ defaultValue: false })
  core: boolean;

  @Column({ defaultValue: true })
  domestic: boolean;

  @Column({ defaultValue: '' })
  metaData: string;
}

// Season id - fk
// Company id - fk
// Hr_details (is a contact_id) - fk
// Assignee Id (is a contact_id) - fk
// Eligibility ids (open for whom?) - array of ids rahegi yeh
// Type(Full time/internship)
// Role - string
// Description of the role - string
// Filled Jaf link(drive link) - string
// jd(drive link) - string
// Salary - object(Postgres me JSONB) ->
// Eg. { CTC_1_yr ?:  , CTC_4_yr ?: , stipend?:  }
// { CTC 1st year (or Stipend in case of internship) CTC 4 years (null in case of internship }
// Core vs non core
// domestic vs International
// Meta data - string - (bond details(if any), or tentative joining date, joining location  etc.)
