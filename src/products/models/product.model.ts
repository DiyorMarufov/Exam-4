import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { deliveryoptions } from 'src/enums/delivery.options';
import { Seller } from '../../seller/model/seller.model';
import { categories } from '../../categories/models/category.model';

@Table({ tableName: 'products' })
export class products extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.ENUM(
      deliveryoptions.PICKUP,
      deliveryoptions.COURIER,
      deliveryoptions.DIGITAL,
    ),
    allowNull: false,
  })
  delivery_options: deliveryoptions;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  image: string;

  @ForeignKey(() => Seller)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  seller_id: number;

  @BelongsTo(() => Seller)
  seller: Seller;

  @ForeignKey(() => categories)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id: number;

  @BelongsTo(() => categories)
  category: categories;
}
