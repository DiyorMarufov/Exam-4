import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { products } from '../../products/models/product.model';
import { Customer } from '../../customer/model/customer.model';

@Table({ tableName: 'reviews' })
export class reviews extends Model {
  @ForeignKey(() => Customer)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  buyer_id: number;

  @BelongsTo(() => Customer, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  customer: Customer;

  @ForeignKey(() => products)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  product_id: number;

  @BelongsTo(() => products, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  product: products;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rating: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  comment: string;
}
