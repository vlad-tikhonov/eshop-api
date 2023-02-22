import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { ParseFormDataJsonPipe } from 'src/pipes/parse-form-data-json.pipe';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { FindProductsDto } from './dto/find-products.dto';
import { PRODUCT_NOTFOUND_ERROR } from './product.constants';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post('create')
	@FormDataRequest()
	@UsePipes(new ParseFormDataJsonPipe({ props: ['description', 'tags'] }), new ValidationPipe())
	async create(@Body() dto: CreateProductDto) {
		return this.productService.create(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	async find(@Body() dto: FindProductDto) {
		return this.productService.findWithReviews(dto);
	}

	@Post('bySlug')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async findProducts(@Body() dto: FindProductsDto) {
		return this.productService.findBySlug(dto);
	}

	@Get(':categoryId')
	async getgetByCategoryId(@Param('categoryId', IdValidationPipe) categoryId: string) {
		const product = await this.productService.getByCategoryId(categoryId);

		if (!product) {
			throw new NotFoundException(PRODUCT_NOTFOUND_ERROR);
		}

		return product;
	}

	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedProduct = await this.productService.deleteById(id);

		if (!deletedProduct) {
			throw new NotFoundException(PRODUCT_NOTFOUND_ERROR);
		}
	}

	@Patch(':id')
	async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateProductDto) {
		const updatedProduct = await this.productService.updateById(id, dto);

		if (!updatedProduct) {
			throw new NotFoundException(PRODUCT_NOTFOUND_ERROR);
		}

		return updatedProduct;
	}
}
