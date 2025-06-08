import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Seller } from '../../seller/model/seller.model';

@Table({ tableName: 'sellerProfile' })
export class SellerProfile extends Model {
  @ForeignKey(() => Seller)
  @Column({ type: DataType.INTEGER, allowNull: false })
  seller_id: number;

  @BelongsTo(() => Seller, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  seller: Seller;

  @Column({ type: DataType.STRING, allowNull: false })
  shop_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  contact_info: string;

  @Column({ type: DataType.FLOAT })
  average_rating: number;
}
