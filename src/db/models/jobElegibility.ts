import { randomUUID } from 'crypto';
import sequelize from 'sequelize';
import { Column, CreatedAt, Model, Table, Unique, UpdatedAt } from 'sequelize-typescript';
import { Course } from './jobEligibility.enum';

@Table({
  tableName: 'jobEligibility',
})
export class jobEligibility extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @Unique
  @Column
  branch: string;

  @Column({
    type: sequelize.ENUM,
    values: Object.values(Course),
    defaultValue: Course.BTECH,
  })
  course: Course;

  @Column
  year: Date;

  @Column
  groupEmailId: string;

  @Column
  @CreatedAt
  createdAt: Date;

  @Column
  @UpdatedAt
  updatedAt: Date;
}
