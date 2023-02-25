import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { TypegooseModule } from 'nestjs-typegoose';
import { CategoryModule } from 'src/category/category.module';
import { FilesModule } from 'src/files/files.module';
import { ProductController } from './product.controller';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';

@Module({
	controllers: [ProductController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: ProductModel,
				schemaOptions: {
					collection: 'Product',
				},
			},
		]),
		NestjsFormDataModule,
		FilesModule,
		CategoryModule,
	],
	providers: [ProductService],
	exports: [ProductService],
})
export class ProductModule {}
