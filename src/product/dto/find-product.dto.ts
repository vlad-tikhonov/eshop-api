import { IsString, IsNumber } from 'class-validator';

export class FindProductDto {
	@IsString()
	productId: string;

	@IsNumber()
	limit: number;
}
