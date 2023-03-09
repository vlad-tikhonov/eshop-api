import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CategoryProductQueryDto } from './dto/category-product-query.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@HttpCode(200)
	@Post()
	async categoryAndProductQuery(@Body() dto: CategoryProductQueryDto) {
		return this.searchService.searchProductsAndCategories(dto.query);
	}
}
