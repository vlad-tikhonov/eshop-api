import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export enum OrderStatus {
	InProgress = 'inProgress',
	Received = 'received',
	Canceled = 'canceled',
}

class ProductsInfo {
	@prop()
	productId: Types.ObjectId;

	@prop()
	count: number;
}

export interface OrderModel extends Base {}
export class OrderModel extends TimeStamps {
	@prop()
	userId: Types.ObjectId;

	@prop({ enum: OrderStatus })
	status: OrderStatus;

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
