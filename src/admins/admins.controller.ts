import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { SignInAdminDto } from './dto/signin-admin.dto';
import { ConfirmSignInAdminDto } from './dto/confirm-signin-admin.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { RolesGuard } from '../guards/roles.guard';
import { Response } from 'express';
import { Roles } from '../enums/admin';
import { checkRoles } from '../decorators/decorator';


@Controller('admin')
@UseInterceptors(CacheInterceptor)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN)
  @Post()
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Post('signin')
  async signInAdmin(@Body() signInAdminDto: SignInAdminDto) {
    return this.adminService.signInAdmin(signInAdminDto);
  }

  @Post('confirm-signin')
  async confirmSignInAdmin(
    @Body() confirmSignInDto: ConfirmSignInAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.confirmSigninAdmin(confirmSignInDto, res);
  }
}
