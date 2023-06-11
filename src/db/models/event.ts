import { randomUUID } from 'crypto';
import sequelize from 'sequelize';
import { Column, CreatedAt, ForeignKey, Model, Table, UpdatedAt, BelongsTo } from 'sequelize-typescript';
import { jobModel } from './job';

@Table({
  tableName: 'event',
})
export class eventModel extends Model {
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

  @Column
  title: string;

  @Column
  venue: string;

  @Column
  @CreatedAt
  startTime: Date;

  @Column
  @UpdatedAt
  endTime: Date;

  @Column
  metaData: string;
}
