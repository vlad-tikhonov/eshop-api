import { IsString, IsNumber, Max, Min, IsMongoId } from 'class-validator';
import { REVIEW_RATING_ERROR_LARGE, REVIEW_RATING_ERROR_LESS } from '../review.constants';
export class CreateReviewDto {
	@IsString()
	name: string;

	@IsString()
	description: string;

	@Min(1, { message: REVIEW_RATING_ERROR_LESS })
	@Max(5, { message: REVIEW_RATING_ERROR_LARGE })
	@IsNumber()
	rating: number;

	@IsMongoId()
	productId: string;
}
