import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderModel } from './order.model';
import { Types } from 'mongoose';

@Injectable()
export class OrderService {
	constructor(
		@InjectModel(OrderModel) private readonly orderModel: ModelType<OrderModel>,
		private readonly userService: UserService,
		private readonly productService: ProductService,
	) {}

	async create(dto: CreateOrderDto): Promise<DocumentType<OrderModel> | null> {
		const user = await this.userService.findUserById(dto.userId);

		if (!user) {
			return null;
		}

		const promises = dto.products.map((p): Promise<boolean> => {
			return new Promise(async (resolve) => {
				const product = await this.productService.findById(p.productId);
				if (!product) {
					resolve(false);
				}
				resolve(true);
			});
		});

		const results = await Promise.all(promises);

		if (results.some((r) => !r)) {
			return null;
		}

		return this.orderModel.create(dto);
	}

	async getByUserId(userId: string) {
		return this.orderModel.find({ userId }).exec();
	}
}
