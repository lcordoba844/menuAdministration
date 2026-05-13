import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Office from './Office';
import { BelongsToMany } from 'sequelize-typescript';
import DietaryRestriction from './DietaryRestriction';
import UserDietaryPreference from './UserDietaryPreference';

@Table({
    tableName: 'users',
    timestamps: true,
})
export default class User extends Model {
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
    username!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'display_name',
    })
    displayName?: string;

    @ForeignKey(() => Office)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: 'office_id',
    })
    officeId!: string;

    @BelongsTo(() => Office)
    office!: Office;

    @Column({
        type: DataType.UUID,
        allowNull: true,
        field: 'department_id',
    })
    departmentId?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'password_hash',
    })
    passwordHash!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        field: 'is_disabled',
    })
    isDisabled!: boolean;

    @BelongsToMany(() => DietaryRestriction, () => UserDietaryPreference)
    dietaryPreferences!: DietaryRestriction[];

    @CreatedAt
    @Column({ field: 'created_at' })
    declare createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    declare updatedAt: Date;
}