import { IsString } from 'class-validator';

export class FindProductsDto {
	@IsString()
	categorySlug: string;
}
