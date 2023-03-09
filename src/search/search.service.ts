import { Injectable } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { ProductService } from 'src/product/product.service';
import { ProductsAndCategoriesResult } from './types/products-and-categories';
@Injectable()
export class SearchService {
	constructor(
		private readonly productService: ProductService,
		private readonly categoryService: CategoryService,
	) {}

	async searchProductsAndCategories(text: string): Promise<ProductsAndCategoriesResult[]> {
		const [products, categories] = await Promise.all([
			this.productService.findByText(text),
			this.categoryService.findByText(text),
		]);

		const constructResult = (data: typeof products | typeof categories, type: string) =>
			data.map((el) => ({
				_id: el._id,
				title: el.title,
				slug: el.slug,
				type: type,
			}));

		return [...constructResult(products, 'product'), ...constructResult(categories, 'category')];
	}
}
