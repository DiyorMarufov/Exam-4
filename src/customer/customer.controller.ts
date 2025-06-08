import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ParseIntPipe,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UserSignInDto } from './dto/user-signIn-dto';
import { ConfirmSignInCustomerDto } from './dto/confirm-signin-customer.dto';
import { EmailToRecoverPassCustomerDto } from './dto/email-toRecoverPassword.dto';
import { VerifyPasswordCustomerDto } from './dto/verify-password-customer.dto';
import { Response } from 'express';
import { GetCookie } from '../decorators/cookie.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { CustomerGuard } from '../guards/customer.guard';
import { checkRoles } from '../decorators/role.decorator';
import { Roles } from '../enums/index';

@UseInterceptors(CacheInterceptor)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('sign-up')
  signUp(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.signUp(createCustomerDto);
  }

  @Post('sign-in')
  signIn(@Body() userSignInDto: UserSignInDto) {
    return this.customerService.signIn({ userSignInDto });
  }

  @Post(`confirm-signin`)
  confirmSignIn(
    @Body() confirmSignInCustomerDto: ConfirmSignInCustomerDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.customerService.confirmSignIn(confirmSignInCustomerDto, res);
  }

  @Post(`accessToken`)
  refreshToken(@GetCookie('refreshTokenCustomer') refreshToken: string) {
    return this.customerService.refreshToken(refreshToken);
  }

  @Post(`signout`)
  signOut(
    @GetCookie('refreshTokenCustomer') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.customerService.signOut(refreshToken, res);
  }

  @Post(`send-otp`)
  sendOtpVerifyUser(
    @Body() emailToRecoverPassCusutomerDto: EmailToRecoverPassCustomerDto,
  ) {
    return this.customerService.sendOtpToVerifyCustomer(
      emailToRecoverPassCusutomerDto,
    );
  }

  @Post(`verifyCustomer`)
  verifyUserToRecoverPass(
    @Body() confirmSignInCustomerDto: ConfirmSignInCustomerDto,
  ) {
    return this.customerService.verifyUserToRecoverPass(
      confirmSignInCustomerDto,
    );
  }

  @Post('recovery-password')
  recoverPass(@Body() verifyPasswordCustomerDto: VerifyPasswordCustomerDto) {
    return this.customerService.recoverPassCustomer(verifyPasswordCustomerDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @UseGuards(AuthGuard, CustomerGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.findOne(id);
  }

  @UseGuards(AuthGuard, CustomerGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @UseGuards(AuthGuard, CustomerGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.remove(id);
  }
}
