import { Types } from 'mongoose';

export type ProductsAndCategoriesResult = {
	_id: Types.ObjectId;
	title: string;
	slug: string;
	type: string;
};
