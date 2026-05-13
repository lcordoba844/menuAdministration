import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({
    tableName: 'offices',
    timestamps: true,
})
export default class Office extends Model {
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
        allowNull: false,
    })
    city!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    country!: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    latitude!: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    longitude!: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
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
