import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { CATEGORY_ID_NOTFOUND_ERROR, CATEGORY_SLUG_NOTFOUND_ERROR } from './category.constants';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserRoles } from '../user/user.model';

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post('create')
	@Roles(UserRoles.Admin)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@FormDataRequest()
	@UsePipes(new ValidationPipe())
	async create(@Body() dto: CreateCategoryDto) {
		return this.categoryService.create(dto);
	}

	@Get('all')
	async getAll() {
		return this.categoryService.getAll();
	}

	@Get(':slug')
	async getBySlug(@Param('slug') slug: string) {
		const category = await this.categoryService.getBySlug(slug);

		if (!category) {
			throw new NotFoundException(CATEGORY_SLUG_NOTFOUND_ERROR);
		}

		return category;
	}

	@Patch(':id')
	async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateCategoryDto) {
		const updatedCategory = await this.categoryService.updateById(id, dto);

		if (!updatedCategory) {
			throw new NotFoundException(CATEGORY_ID_NOTFOUND_ERROR);
		}

		return updatedCategory;
	}

	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedCategory = await this.categoryService.delete(id);

		if (!deletedCategory) {
			throw new NotFoundException(CATEGORY_ID_NOTFOUND_ERROR);
		}

		return deletedCategory;
	}
}
