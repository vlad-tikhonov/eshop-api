import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class ProductsInfo {
	@prop()
	productId: Types.ObjectId;

	@prop()
	count: string;
}

export interface OrderModel extends Base {}
export class OrderModel extends TimeStamps {
	@prop()
	userId: Types.ObjectId;

	@prop()
	locality: string;

	@prop()
	street: string;

	@prop()
	house: string;

	@prop()
	apartment: string;

	@prop()
	extra?: string;

	@prop()
	date: string;

	@prop()
	time: string;

	@prop({ type: () => [ProductsInfo], _id: false })
	products: ProductsInfo[];
}
