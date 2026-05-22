// src/models/MenuOption.ts
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from 'sequelize-typescript';

import Menu from '@/models/menu.model';

@Table({
  tableName: 'menu_options',
  timestamps: true,
})
export default class MenuOption extends Model {
  @ForeignKey(() => Menu)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'menu_id',
  })
  declare menuId: string;

  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'option_number',
  })
  declare optionNumber: number;

  @BelongsTo(() => Menu)
  menu!: Menu;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'is_active',
  })
  isActive!: boolean;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}
