import { IsString } from 'class-validator';
export class CreateCategoryDto {
	@IsString()
	image: string;

	@IsString()
	title: string;

	@IsString()
	slug: string;
}
