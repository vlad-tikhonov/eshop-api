import { IsNumber, IsMongoId } from 'class-validator';

export class FindProductDto {
	@IsMongoId()
	productId: string;

	@IsNumber()
	limit: number;
}
