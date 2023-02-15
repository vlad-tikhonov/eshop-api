import { Module } from '@nestjs/common';
import { CategoryModule } from 'src/category/category.module';
import { ProductModule } from 'src/product/product.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
	controllers: [SearchController],
	imports: [CategoryModule, ProductModule],
	providers: [SearchService],
})
export class SearchModule {}
