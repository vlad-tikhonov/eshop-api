import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, ValidateNested, Max, Min, IsOptional } from 'class-validator';

class ProductDescriptionDto {
	@IsString()
	brand: string;

	@IsString()
	country: string;

	@IsString()
	package: string;
}

export class CreateProductDto {
	@IsString()
	image: string;

	@IsString()
	title: string;

	@IsNumber()
	price: number;

	@IsNumber()
	priceWithCard: number;

	@Min(1)
	@Max(90)
	@IsNumber()
	@IsOptional()
	discount?: number;

	@ValidateNested()
	@Type(() => ProductDescriptionDto)
	description: ProductDescriptionDto;

	@IsString()
	categoryId: string;

	@IsArray()
	@IsString({ each: true })
	tags: string[];

	@IsString()
	code: string;
}
