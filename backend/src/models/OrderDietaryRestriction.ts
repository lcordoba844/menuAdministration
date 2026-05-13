import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import Order from './Order';
import DietaryRestriction from './DietaryRestriction';

@Table({ tableName: 'order_dietary_restrictions', timestamps: false })
export default class OrderDietaryRestriction extends Model {
    @ForeignKey(() => Order)
    @Column({ type: DataType.UUID, primaryKey: true, field: 'order_id' })
    declare orderId: string;

    @ForeignKey(() => DietaryRestriction)
    @Column({ type: DataType.UUID, primaryKey: true, field: 'restriction_id' })
    declare restrictionId: string;
}