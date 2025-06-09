import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';
import { AuthGuard } from '../guards/auth.guard';
import { checkRoles } from '../decorators/role.decorator';
import { Roles } from '../enums/index';
import { RolesGuard } from '../guards/roles.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFiles(new ImageValidationPipe()) files?: Express.Multer.File[],
  ) {
    return this.categoriesService.create(createCategoryDto, files);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFiles(new ImageValidationPipe()) files?: Express.Multer.File[],
  ) {
    return this.categoriesService.update(id, updateCategoryDto, files);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
