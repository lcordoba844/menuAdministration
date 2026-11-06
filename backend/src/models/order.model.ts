import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import Menu from '@/models/menu.model';
import MenuOption from '@/models/menu_option.model';
import User from '@/models/user.model';

export enum OrderTargetKind {
  SELF = 'self',
  GUEST = 'guest',
  USER = 'user',
}

export enum DecisionKind {
  OPTION = 'option',
  NO_ORDER = 'no_order',
}

@Table({
  tableName: 'orders',
  timestamps: true,
})
export default class Order extends Model {
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
  menuId!: string;

  @ForeignKey(() => MenuOption)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'menu_option_id',
  })
  menuOptionId?: string | null;

  @BelongsTo(() => MenuOption)
  menuOption?: MenuOption | null;

  @BelongsTo(() => Menu)
  menu!: Menu;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'placed_by_user_id',
  })
  placedByUserId!: string;

  @BelongsTo(() => User, 'placedByUserId')
  placedBy!: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'target_user_id',
  })
  targetUserId?: string | null;

  @BelongsTo(() => User, 'targetUserId')
  targetUser?: User | null;

  @Column({
    type: DataType.ENUM(...Object.values(OrderTargetKind)),
    allowNull: false,
    field: 'target_kind',
  })
  targetKind!: OrderTargetKind;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'target_guest_name',
  })
  targetGuestName?: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(DecisionKind)),
    allowNull: false,
    field: 'decision_kind',
  })
  decisionKind!: DecisionKind;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    defaultValue: '',
  })
  comment!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'locked_at',
  })
  lockedAt?: Date | null;

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
