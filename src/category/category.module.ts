import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CategoryController } from './category.controller';
import { CategoryModel } from './category.model';

@Module({
	controllers: [CategoryController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: CategoryModel,
				schemaOptions: {
					collection: 'Category',
				},
			},
		]),
	],
})
export class CategoryModule {}
