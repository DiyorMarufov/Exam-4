import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { SellerGuard } from '../guards/seller.guard';
import { AuthGuard } from '../guards/auth.guard';
import { checkRoles } from '../decorators/role.decorator';
import { Roles } from '../enums/index';
import { RolesGuard } from '../guards/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.SELLER)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile(new ImageValidationPipe()) file?: Express.Multer.File,
  ) {
    return this.productsService.create(createProductDto, file);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.SELLER)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile(new ImageValidationPipe()) file?: Express.Multer.File,
    @Req() req?,
  ) {
    return this.productsService.update(id, updateProductDto, file, req);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @checkRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.SELLER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req?) {
    return this.productsService.remove(id, req);
  }
}
