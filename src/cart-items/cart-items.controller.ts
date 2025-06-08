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
  Req,
} from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { AuthGuard } from '../guards/auth.guard';
import { checkRoles } from '../decorators/role.decorator';
import { Roles } from '../enums/index';
import { RolesGuard } from '../guards/roles.guard';

@Controller('cartItems')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)
  @checkRoles()
  @Post()
  create(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemsService.create(createCartItemDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Get()
  findAllCartItems() {
    return this.cartItemsService.findAllCartItems();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)
  @Get('customer')
  findAll(@Req() req?) {
    return this.cartItemsService.findAll(req);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req?) {
    return this.cartItemsService.findOne(id, req);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Req() req?,
  ) {
    return this.cartItemsService.update(id, updateCartItemDto, req);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req?) {
    return this.cartItemsService.remove(id, req);
  }
}
