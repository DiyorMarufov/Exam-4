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
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from '../guards/auth.guard';
import { checkRoles } from '../decorators/role.decorator';
import { Roles } from '../enums/index';
import { RolesGuard } from '../guards/roles.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)
  @Get('customer')
  findAlForCustomerl(@Req() req?) {
    return this.paymentService.findAllForCustomer(req);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.remove(id);
  }
}
