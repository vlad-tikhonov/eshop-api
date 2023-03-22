import { IsString, IsArray, ValidateNested, IsOptional, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

class ProductsInfoDto {
	@IsMongoId()
	productId: string;

	@IsString()
	count: string;
}

export class CreateOrderDto {
	@IsMongoId()
	userId: string;

	@IsString()
	locality: string;

	@IsString()
	street: string;

	@IsString()
	house: string;

	@IsString()
	apartment: string;

	@IsOptional()
	@IsString()
	extra?: string;

	@IsString()
	date: string;

	@IsString()
	time: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ProductsInfoDto)
	products: ProductsInfoDto[];
}
