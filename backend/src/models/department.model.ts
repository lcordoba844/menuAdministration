import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({
    tableName: 'departments',
    timestamps: true,
})

export default class Department extends Model {
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
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    description?: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        field: 'is_active'
    })
    isActive!: boolean;

    @CreatedAt
    @Column({ field: 'created_at' })
    declare createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    declare updatedAt: Date;

}
