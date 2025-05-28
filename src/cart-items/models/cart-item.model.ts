import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'cart-items' })
export class CartItems extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cart_id: number;

  @Column({
    allowNull: true,
  })
  product_id?: number;

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
