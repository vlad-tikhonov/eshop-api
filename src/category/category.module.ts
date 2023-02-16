import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { TypegooseModule } from 'nestjs-typegoose';
import { FilesModule } from 'src/files/files.module';
import { CategoryController } from './category.controller';
import { CategoryModel } from './category.model';
import { CategoryService } from './category.service';

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
		NestjsFormDataModule,
		FilesModule,
	],
	providers: [CategoryService],
	exports: [CategoryService],
})
export class CategoryModule {}
