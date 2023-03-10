import { Injectable } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { ProductService } from 'src/product/product.service';
@Injectable()
export class SearchService {
	constructor(
		private readonly productService: ProductService,
		private readonly categoryService: CategoryService,
	) {}

	async searchProductsAndCategories(text: string): Promise<
		{
			id: string;
			title: string;
			slug: string;
			type: string;
		}[]
	> {
		const [products, categories] = await Promise.all([
			this.productService.findByText(text),
			this.categoryService.findByText(text),
		]);

		const resultProducts = products.map((p) => ({
			id: p._id.toHexString(),
			title: p.title,
			slug: `${p.categorySlug}/${p.slug}`,
			type: 'product',
		}));

		const resultCategories = categories.map((c) => ({
			id: c._id.toHexString(),
			title: c.title,
			slug: c.slug,
			type: 'category',
		}));

		const sortedResult = [...resultProducts, ...resultCategories].sort((a, b) =>
			a.title > b.title ? 1 : -1,
		);

		return sortedResult;
	}
}
