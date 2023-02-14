import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

class ProductDescription {
	@prop()
	brand: string;

	@prop()
	country: string;

	@prop()
	package: string;
}

export interface ProductModel extends Base {}
export class ProductModel extends TimeStamps {
	@prop()
	image: string;

	@prop()
	title: string;

	@prop()
	price: number;

	@prop()
	priceWithCard: number;

	@prop()
	discount: number;

	@prop()
	calculatedRating: number;

	@prop({ type: () => ProductDescription })
	description: ProductDescription;

	@prop()
	categoryId: Types.ObjectId;

	@prop({ type: () => [String], _id: false })
	tags: string[];

	@prop()
	code: string;
}
