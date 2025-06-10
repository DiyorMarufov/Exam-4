import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  UseGuards,
  Res,
  UseInterceptors,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { SignInAdminDto } from './dto/signin-admin-dto';
import { ConfirmSignInAdminDto } from './dto/confirm-signin-admin';
import { StatusAdminDto } from './dto/active-deactive-admin.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { SelfGuard } from '../guards/self.guard';
import { Response } from 'express';
import { Roles } from '../enums/index';
import { checkRoles } from '../decorators/role.decorator';
import { GetCookie } from '../decorators/cookie.decorator';

@UseInterceptors(CacheInterceptor)
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN)
  @Post('createAdmin')
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.createAdmin(createAdminDto);
  }

  @Post('signin-superadmin')
  signInSuperAdmin(
    @Body() signInAdminDto: SignInAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminsService.signInSuperAdmin(signInAdminDto, res);
  }

  @Post('signin')
  signInAdmin(@Body() signInAdminDto: SignInAdminDto) {
    return this.adminsService.signInAdmin(signInAdminDto);
  }

  @Post('confirm-signin')
  confirmSignInAdmin(
    @Body() confirmSignInAdminDto: ConfirmSignInAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminsService.confirmSigninAdmin(confirmSignInAdminDto, res);
  }

  @Post('refreshToken-superadmin')
  accessTokenSuperAdmin(
    @GetCookie('refreshTokenSuperAdmin') refreshToken: string,
  ) {
    return this.adminsService.refreshTokenSuperAdmin(refreshToken);
  }

  @Post('refreshToken')
  accessTokenAdmin(@GetCookie('refreshTokenAdmin') refreshToken: string) {
    return this.adminsService.refreshTokenAdmin(refreshToken);
  }

  @Post('signout-admin')
  signOutAdmin(
    @GetCookie('refreshTokenAdmin') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminsService.signOutAdmin(refreshToken, res);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN)
  @Get()
  getAllAdmins() {
    return this.adminsService.getAllAdmins();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Get('active-customers')
  getActiveCustomers() {
    return this.adminsService.getActiveCustomers();
  }

  @UseGuards(AuthGuard, SelfGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Get(':id')
  getAdminById(@Param('id', ParseIntPipe) id: number) {
    return this.adminsService.getAdminById(id);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Patch(`:id`)
  updateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminsService.updateAdmin(id, updateAdminDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN)
  @Patch('status/:id')
  updateStatusAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: StatusAdminDto,
  ) {
    return this.adminsService.activeDeactiveAdmin(id, statusDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN)
  @Delete(':id')
  deleteAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.adminsService.deleteAdmin(id);
  }
}
