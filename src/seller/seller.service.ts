import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Seller } from './model/seller.model';
import { CreateSellerDto } from './dto/create-seller.dto';
import { encrypt } from 'src/utils/encrypt-decrypt';
import { Roles } from 'src/enums';

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(Seller)
    private sellerModel: typeof Seller,
  ) {}

  async create(createSellerDto: CreateSellerDto): Promise<object> {
    try {
      const existingEmail = await this.sellerModel.findOne({
        where: { email: createSellerDto.email },
      });
      const existingPhone = await this.sellerModel.findOne({
        where: { phone: createSellerDto.phone },
      });
      if (existingEmail) {
        throw new BadRequestException('Email already exists');
      }
      if (existingPhone) {
        throw new BadRequestException('Phone number already exists');
      }
      const { password } = createSellerDto;
      const hashed_password = await encrypt(password);

      const newSeller = await this.sellerModel.create({
        ...createSellerDto,
        role: Roles.SELLER,
        hashed_password,
      });
      return newSeller;
    } catch (error) {
      return error.message;
    }
  }

  async findAll(): Promise<object> {
    const sellers = await this.sellerModel.findAll();
    return { statuscode: 200, data: { sellers } };
  }

  async findOne(id: number): Promise<object> {
    const seller = await this.sellerModel.findByPk(id);
    return { statuscode: 200, data: { seller } };
  }

  async remove(id: number): Promise<object> {
    const seller = await this.sellerModel.destroy({ where: { id } });
    return { statuscode: 200, data: {} };
  }
}
