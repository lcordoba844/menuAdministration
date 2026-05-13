import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import MenuOption from './menu_option.model';

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
        type: DataType.STRING,
        allowNull: false,
    })
    title!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'deadline_at'
    })
    deadlineAt!: Date;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        field: 'is_active'
    })
    isActive!: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        field: 'archived_at'
    })
    archivedAt?: Date;
    
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: 'created_by_user_id'
    })
    createdByUserId!: string;

    @HasMany(() => MenuOption)
    options!: MenuOption[];

    @CreatedAt
    @Column({ field: 'created_at' })
    declare createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    declare updatedAt: Date;
}
