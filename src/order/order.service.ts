import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderModel } from './order.model';
import { Types } from 'mongoose';
import { OrderStatus } from './order.model';

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

		const orderId = new Types.ObjectId().toHexString();

		const newOrder = new this.orderModel({
			_id: orderId,
			status: OrderStatus.InProgress,
			...dto,
		});

		return newOrder.save();
	}

	async getByUserId(userId: string) {
		return this.orderModel
			.aggregate([
				{
					$match: {
						userId: new Types.ObjectId(userId),
					},
				},
				{
					$lookup: {
						from: 'Product',
						localField: 'products.productId',
						foreignField: '_id',
						as: 'productsData',
					},
				},
				{
					$project: {
						_id: 1,
						status: 1,
						date: 1,
						time: 1,
						products: {
							$map: {
								input: '$products',
								as: 'one',
								in: {
									$mergeObjects: [
										'$$one',
										{
											$arrayElemAt: [
												{
													$filter: {
														input: '$productsData',
														as: 'two',
														cond: { $eq: ['$$two._id', '$$one.productId'] },
													},
												},
												0,
											],
										},
									],
								},
							},
						},
					},
				},
				{
					$unwind: '$products',
				},
				{
					$project: {
						'products.productId': 0,
					},
				},
				{
					$group: {
						_id: '$_id',
						status: { $first: '$status' },
						date: { $first: '$date' },
						time: { $first: '$time' },
						total: {
							$sum: {
								$multiply: ['$products.count', '$products.price'],
							},
						},
						products: { $push: '$products' },
					},
				},
			])
			.exec();
	}
}
