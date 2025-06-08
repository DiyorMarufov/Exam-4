import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  Res,
  ParseIntPipe,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { ConfirmSignInSellerDto } from './dto/confirm-signin-seller.dto';
import { SignInSellerDto } from './dto/sing-in-seller.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { GetCookie } from '../decorators/cookie.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { SellerGuard } from '../guards/seller.guard';
import { checkRoles } from '../decorators/role.decorator';
import { Roles } from '../enums/index';

@UseInterceptors(CacheInterceptor)
@Controller('sellers')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('sign-up')
  signUp(@Body() createSellerDto: CreateSellerDto) {
    return this.sellerService.signUp(createSellerDto);
  }

  @Post('sign-in')
  singIn(@Body() signInSellerDto: SignInSellerDto) {
    return this.sellerService.signIn({ signInSellerDto });
  }

  @Post(`confirm-signin`)
  confirmSignIn(
    @Body() confirmSignInSellerDto: ConfirmSignInSellerDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.sellerService.confirmSignin(confirmSignInSellerDto, res);
  }

  @Post(`accessToken`)
  refreshToken(@GetCookie('refreshTokenSeller') refreshToken: string) {
    return this.sellerService.refreshToken(refreshToken);
  }

  @Post(`signout`)
  signOut(
    @GetCookie('refreshTokenSeller') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.sellerService.signOut(refreshToken, res);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)
  @Get()
  findAll() {
    return this.sellerService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER, Roles.SELLER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.findOne(id);
  }

  @UseGuards(AuthGuard, SellerGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.SELLER)
  @Patch(`:id`)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    return this.sellerService.update(id, updateSellerDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.remove(id);
  }
}
