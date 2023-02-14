import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserInfo } from '../decorators/user-info.decorator';
import { UserModel } from '../user/user.model';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUNT_ERROR } from './review.constants';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		const deletedDoc = await this.reviewService.delete(id);

		if (!deletedDoc) {
			throw new NotFoundException(REVIEW_NOT_FOUNT_ERROR);
		}
	}
	//delete decorator
	@Get('byProduct/:productId')
	async getByProduct(@Param('productId') productId: string, @UserInfo() user: UserModel) {
		return this.reviewService.findByProductId(productId);
	}
}
