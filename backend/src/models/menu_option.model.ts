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
  BelongsToMany,
} from 'sequelize-typescript';

import DietaryRestriction from '@/models/dietary_restriction.model';
import Menu from '@/models/menu.model';

@Table({
  tableName: 'menu_options',
  timestamps: true,
})
export default class MenuOption extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Menu)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'menu_id',
  })
  declare menuId: string;

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
    defaultValue: '',
  })
  description!: string;

  @BelongsToMany(() => DietaryRestriction, {
    through: 'menu_option_dietary_restrictions',
    foreignKey: 'menuOptionId',
    otherKey: 'dietaryRestrictionId',
  })
  dietaryRestrictions!: DietaryRestriction[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  enabled!: boolean;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}
