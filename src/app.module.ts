import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { OrderModule } from './order/order.module';

@Module({
	imports: [AuthModule, CategoryModule, ProductModule, ReviewModule, OrderModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
