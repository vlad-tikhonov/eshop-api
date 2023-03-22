import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { OrderModel } from './order.model';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';

@Module({
	controllers: [OrderController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: OrderModel,
				schemaOptions: {
					collection: 'Order',
				},
			},
		]),
		ProductModule,
		UserModule,
	],
	providers: [OrderService],
	exports: [OrderService],
})
export class OrderModule {}
