import {
	IsString,
	IsNumber,
	IsArray,
	ValidateNested,
	Max,
	Min,
	IsOptional,
	IsMongoId,
} from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';
import { Type } from 'class-transformer';
class ProductDescriptionDto {
	@IsString()
	brand: string;

	@IsString()
	country: string;

	@IsString()
	package: string;
}

export class CreateProductDto {
	@IsFile()
	@HasMimeType(['image/jpeg', 'image/png', 'image/webp'])
	image: MemoryStoredFile;

	@IsString()
	@Type(() => String)
	title: string;

	@IsNumber()
	@Type(() => Number)
	price: number;

	@IsNumber()
	@Type(() => Number)
	priceWithCard: number;

	@Min(1)
	@Max(90)
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	discount?: number;

	@ValidateNested()
	@Type(() => ProductDescriptionDto)
	description: ProductDescriptionDto;

	@IsMongoId()
	@Type(() => String)
	categoryId: string;

	@IsArray()
	@IsString({ each: true })
	tags: string[];

	@IsString()
	@Type(() => String)
	code: string;

	@IsString()
	@Type(() => String)
	slug: string;
}
