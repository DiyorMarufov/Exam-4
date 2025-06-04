import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SellerProfilesDbService } from './seller-profiles.service';
import { CreateSellerProfileDto } from './dto/create-seller-profile.dto';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto';

@Controller('seller-profiles')
export class SellerProfilesController {
  constructor(
    private readonly sellerProfilesService: SellerProfilesDbService,
  ) {}

  @Post()
  create(@Body() createSellerProfileDto: CreateSellerProfileDto) {
    return this.sellerProfilesService.create(createSellerProfileDto);
  }

  @Get()
  findAll() {
    return this.sellerProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sellerProfilesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSellerProfileDto: UpdateSellerProfileDto,
  ) {
    return this.sellerProfilesService.update(id, updateSellerProfileDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sellerProfilesService.remove(id);
  }
}
