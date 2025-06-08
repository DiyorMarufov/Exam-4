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
import { RewiewsService } from './rewiews.service';
import { CreateReviewDto } from './dto/create-rewiew.dto';
import { UpdateRewiewDto } from './dto/update-rewiew.dto';
import { AuthGuard } from '../guards/auth.guard';
import { checkRoles } from '../decorators/role.decorator';
import { Roles } from '../enums/index';
import { RolesGuard } from '../guards/roles.guard';

@Controller('rewiews')
export class RewiewsController {
  constructor(private readonly rewiewsService: RewiewsService) {}

  @UseGuards(AuthGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER, Roles.SELLER)
  @Post()
  create(@Body() createRewiewDto: CreateReviewDto) {
    return this.rewiewsService.create(createRewiewDto);
  }

  @Get()
  findAll() {
    return this.rewiewsService.findAll();
  }

  @Get('seller/:id')
  getAverageRating(@Param('id', ParseIntPipe) id: number) {
    return this.rewiewsService.getAverageRating(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rewiewsService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRewiewDto: UpdateRewiewDto,
    @Req() req?,
  ) {
    return this.rewiewsService.update(id, updateRewiewDto, req);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req?) {
    return this.rewiewsService.remove(id, req);
  }
}
