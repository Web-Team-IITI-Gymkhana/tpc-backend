import { randomUUID } from 'crypto';
import sequelize from 'sequelize';
import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Status } from './status.enum';
import { jobModel } from './job';

@Table({
  tableName: 'status',
})
export class statusModel extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @ForeignKey(() => jobModel)
  @Column(sequelize.UUID)
  jobId: string;

  @BelongsTo(() => jobModel, 'id')
  job: jobModel;

  @Column({
    type: sequelize.ENUM,
    values: Object.values(Status),
    defaultValue: Status.SCHEDULED,
  })
  status: Status;

  @Column({ defaultValue: '' })
  metaData: string;
}
