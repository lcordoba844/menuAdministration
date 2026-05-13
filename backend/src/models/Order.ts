import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Menu from './Menu';
import User from './User';
import MenuOption from './MenuOption';
import { BelongsToMany } from 'sequelize-typescript';
import DietaryRestriction from './DietaryRestriction';
import OrderDietaryRestriction from './OrderDietaryRestriction';

export enum OrderTargetKind {
    SELF = 'self',
    GUEST = 'guest',
    USER = 'user'
}

export enum DecisionKind {
    OPTION = 'option',
    NO_ORDER = 'no_order'
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
        field: 'menu_id'
    })
    menuId!: string;

    @BelongsTo(() => Menu)
    menu!: Menu;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: 'placed_by_user_id'
    })
    placedByUserId!: string;

    @BelongsTo(() => User, 'placed_by_user_id')
    placedBy!: User;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: true,
        field: 'target_user_id'
    })
    targetUserId?: string;

    @BelongsTo(() => User, 'target_user_id')
    targetUser?: User;

    @Column({
        type: DataType.ENUM(...Object.values(OrderTargetKind)),
        allowNull: false,
        field: 'target_kind'
    })
    targetKind!: OrderTargetKind;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'target_guest_name'
    })
    targetGuestName?: string;

    @Column({
        type: DataType.ENUM(...Object.values(DecisionKind)),
        allowNull: false,
        field: 'decision_kind'
    })
    decisionKind!: DecisionKind;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        field: 'menu_option_number'
    })
    menuOptionNumber?: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    comment?: string;

   @BelongsToMany(() => DietaryRestriction, () => OrderDietaryRestriction)
    dietaryRestrictions!: DietaryRestriction[];

    @Column({
        type: DataType.DATE,
        allowNull: true,
        field: 'locked_at'
    })
    lockedAt?: Date;

    @CreatedAt
    @Column({ field: 'created_at' })
    declare createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    declare updatedAt: Date;
}