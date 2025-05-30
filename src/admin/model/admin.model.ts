import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Roles, Status } from 'src/ENUM';

@Table({ tableName: 'admins' })
export class Admin extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @Column({
    type: DataType.ENUM(Roles.SUPERADMIN, Roles.ADMIN),
    allowNull: false,
    defaultValue: Roles.ADMIN,
  })
  role: Roles;

  @Column({
    type: DataType.ENUM(Status.ACTIVE, Status.INACTIVE),
    allowNull: false,
    defaultValue: Status.ACTIVE,
  })
  status: string;
}
