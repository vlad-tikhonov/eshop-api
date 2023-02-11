export class ProductModel {
	image: string;
	title: string;
	price: number;
	priceWithCard: number;
	discount: number;
	calculatedRating: number;
	description: {
		brand: string;
		country: string;
		package: string;
	};
	categories: string[];
	tags: string;
	code: string;
}
