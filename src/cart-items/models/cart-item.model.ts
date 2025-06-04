import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Carts } from '../../carts/models/cart.model';
import { products } from '../../products/models/product.model';

@Table({ tableName: 'cart-items' })
export class CartItems extends Model {
  @ForeignKey(() => Carts)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cart_id: number;

  @BelongsTo(() => Carts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  cart: Carts;

  @ForeignKey(() => products)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  product_id: number;

  @BelongsTo(() => products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  products: products;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  price: number;
}
