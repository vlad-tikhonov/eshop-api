import { Injectable } from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose';
import { CategoryModel } from 'src/category/category.model';
import { CategoryService } from 'src/category/category.service';
import { ProductModel } from 'src/product/product.model';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class SearchService {
	constructor(
		private readonly productService: ProductService,
		private readonly categoryService: CategoryService,
	) {}

	async categoryAndProductQuery(text: string): Promise<{
		categories: DocumentType<CategoryModel>[];
		products: DocumentType<ProductModel>[];
	}> {
		const result = await Promise.all([
			this.productService.findByText(text),
			this.categoryService.findByText(text),
		]);

		return {
			products: result[0],
			categories: result[1],
		};
	}
}
