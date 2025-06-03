import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'sellerProfile' })
export class SellerProfile extends Model {
  @Column({ type: DataType.INTEGER, allowNull: false })
  seller_id: number;
  @Column({ type: DataType.STRING, allowNull: false })
  shop_name: string;
  @Column({ type: DataType.STRING, allowNull: false })
  contact_info: string;
  @Column({ type: DataType.STRING, allowNull: false })
  avarage_rating: string;
}
