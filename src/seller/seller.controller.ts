import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { SignInSellerDto } from './dto/sing-in-seller.dto';

@Controller('sellers')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('sign-up')
  signUp(@Body() createSellerDto: CreateSellerDto) {
    return this.sellerService.signUp(createSellerDto);
  }

  @Post('sign-in')
  singIn(
    @Body() signInSellerDto: SignInSellerDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.sellerService.signIn(signInSellerDto, res);
  }
  @Get()
  findAll() {
    return this.sellerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellerService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellerService.remove(+id);
  }
}
