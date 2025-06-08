import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req
} from '@nestjs/common';
import { SellerProfilesDbService } from './seller-profiles.service';
import { CreateSellerProfileDto } from './dto/create-seller-profile.dto';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { checkRoles } from '../decorators/role.decorator';
import { Roles } from '../enums/index';

@Controller('seller-profiles')
export class SellerProfilesController {
  constructor(
    private readonly sellerProfilesService: SellerProfilesDbService,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.SELLER)
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

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSellerProfileDto: UpdateSellerProfileDto,
  ) {
    return this.sellerProfilesService.update(id, updateSellerProfileDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sellerProfilesService.remove(id);
  }
}
