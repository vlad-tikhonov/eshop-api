import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface CategoryModel extends Base {}
export class CategoryModel extends TimeStamps {
	@prop()
	image: string;

	@prop({ unique: true })
	title: string;

	@prop({ unique: true })
	slug: string;
}
