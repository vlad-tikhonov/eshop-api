import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigService } from '@nestjs/config/dist';
import { getMongoConfig } from './configs/mongo.config';
import { UserModule } from './user/user.module';
import { SearchModule } from './search/search.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		AuthModule,
		CategoryModule,
		ProductModule,
		ReviewModule,
		OrderModule,
		UserModule,
		SearchModule,
	],
})
export class AppModule {}
