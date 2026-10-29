import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import Department from '@/models/department.model';
import DietaryRestriction from '@/models/dietary_restriction.model';
import Office from '@/models/office.model';
import User from '@/models/user.model';

@Table({
  tableName: 'diners',
  timestamps: true,
})
export default class Diner extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { notEmpty: true, len: [1, 255] },
  })
  name!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    field: 'user_id',
  })
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Office)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'office_id',
  })
  officeId!: string;

  @BelongsTo(() => Office)
  office!: Office;

  @ForeignKey(() => Department)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'department_id',
  })
  departmentId!: string;

  @BelongsTo(() => Department)
  department!: Department;

  @BelongsToMany(() => DietaryRestriction, {
    through: 'diner_dietary_restrictions',
    foreignKey: 'dinerId',
    otherKey: 'dietaryRestrictionId',
  })
  dietaryRestrictions!: DietaryRestriction[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
