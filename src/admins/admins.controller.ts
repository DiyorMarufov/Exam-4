import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { SignInAdminDto } from './dto/signin-admin.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Post('signin')
  async signInAdmin(@Body() signInAdminDto: SignInAdminDto) {
    return this.adminService.signInAdmin(signInAdminDto);
  }
}
