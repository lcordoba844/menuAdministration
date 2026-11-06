import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import MenuOption from '@/models/menu_option.model';
import User from '@/models/user.model';

@Table({
  tableName: 'menus',
  timestamps: true,
})
export default class Menu extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  date!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'deadline_at',
  })
  deadlineAt!: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  enabled!: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'created_by_user_id',
  })
  createdByUserId!: string;

  @BelongsTo(() => User)
  createdByUser!: User;

  @HasMany(() => MenuOption)
  options!: MenuOption[];

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}
