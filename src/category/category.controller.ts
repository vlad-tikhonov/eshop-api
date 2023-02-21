import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { CATEGORY_NOTFOUND_ERROR } from './category.constants';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post('create')
	@FormDataRequest()
	@UsePipes(new ValidationPipe())
	async create(@Body() dto: CreateCategoryDto) {
		return this.categoryService.create(dto);
	}

	@Get('all')
	async getAll() {
		return this.categoryService.getAll();
	}

	@Patch(':id')
	async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateCategoryDto) {
		const updatedCategory = await this.categoryService.updateById(id, dto);

		if (!updatedCategory) {
			throw new NotFoundException(CATEGORY_NOTFOUND_ERROR);
		}

		return updatedCategory;
	}

	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedCategory = await this.categoryService.delete(id);

		if (!deletedCategory) {
			throw new NotFoundException(CATEGORY_NOTFOUND_ERROR);
		}

		return deletedCategory;
	}
}
