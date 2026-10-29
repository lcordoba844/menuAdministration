import { DataTypes } from 'sequelize';
import {
  Column,
  CreatedAt,
  DataType,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import Diner from '@/models/diner.model';

export enum UserRole {
  user = 'USER',
  admin = 'ADMIN',
}

@Table({
  tableName: 'users',
  timestamps: true,
})
export default class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    validate: {
      isUUID: 4,
    },
  })
  id!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 255],
    },
  })
  password!: string;

  @Column({
    type: DataTypes.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.user,
    validate: {
      isIn: [Object.values(UserRole)],
    },
  })
  role!: UserRole;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  enabled!: boolean;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'created_by',
    validate: {
      isUUID: {
        args: 4,
        msg: 'createdBy must be a valid UUID',
      },
    },
  })
  createdBy?: string;

  @HasOne(() => Diner)
  diner!: Diner | null;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
