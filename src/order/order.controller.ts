import {
	Controller,
	Post,
	Body,
	UsePipes,
	ValidationPipe,
	Get,
	Param,
	BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { INVALID_USER_OR_PRODUCT } from './order.constants';

@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Post('create')
	@UsePipes(new ValidationPipe())
	async create(@Body() dto: CreateOrderDto) {
		const result = await this.orderService.create(dto);

		if (!result) {
			throw new BadRequestException(INVALID_USER_OR_PRODUCT);
		}

		return result;
	}

	@Get(':userId')
	async getByUserId(@Param('userId', IdValidationPipe) userId: string) {
		const result = await this.orderService.getByUserId(userId);

		return result;
	}
}
