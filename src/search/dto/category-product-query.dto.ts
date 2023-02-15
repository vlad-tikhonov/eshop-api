import { IsString } from 'class-validator';

export class CategoryProductQueryDto {
	@IsString()
	query: string;
}
