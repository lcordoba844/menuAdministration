import { DataTypes } from 'sequelize';
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

enum UserRole {
  user = 'USER',
  admin = 'ADMIN',
}

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
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
    type: DataType.UUID,
    allowNull: true,
    field: 'limit_id',
    validate: {
      isUUID: {
        args: 4,
        msg: 'limitId must be a valid UUID',
      },
    },
  })
  limitId?: string;

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

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
