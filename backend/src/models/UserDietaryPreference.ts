import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import User from './User';
import DietaryRestriction from './DietaryRestriction';

@Table({ tableName: 'user_dietary_preferences', timestamps: false })
export default class UserDietaryPreference extends Model {
    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, primaryKey: true, field: 'user_id' })
    declare userId: string;

    @ForeignKey(() => DietaryRestriction)
    @Column({ type: DataType.UUID, primaryKey: true, field: 'restriction_id' })
    declare restrictionId: string;
}