import { Injectable } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { FilesService } from 'src/files/files.service';
import { ReviewModel } from 'src/review/review.model';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { FindProductsDto } from './dto/find-products.dto';
import { ProductModel } from './product.model';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>,
		private readonly filesService: FilesService,
	) {}

	async create(dto: CreateProductDto): Promise<DocumentType<ProductModel>> {
		const productId = new Types.ObjectId().toHexString();
		const imageUrl = await this.filesService.saveFile(dto.image, 'product', productId);
		const newProduct = new this.productModel({
			_id: productId,
			image: imageUrl,
			title: dto.title,
			price: dto.price,
			priceWithCard: dto.priceWithCard,
			discount: dto.discount,
			description: {
				brand: dto.description.brand,
				country: dto.description.country,
				package: dto.description.package,
			},
			categoryId: dto.categoryId,
			categorySlug: dto.categorySlug,
			tags: dto.tags,
			code: dto.code,
			slug: dto.slug,
		});

		return newProduct.save();
	}

	async deleteById(id: string): Promise<DocumentType<ProductModel> | null> {
		return this.productModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreateProductDto): Promise<DocumentType<ProductModel> | null> {
		return this.productModel.findByIdAndUpdate(id, dto, { new: true });
	}

	async getByCategoryId(categoryId: string): Promise<DocumentType<ProductModel>[]> {
		return this.productModel.find({ categoryId: new Types.ObjectId(categoryId) }).exec();
	}

	async findByText(text: string): Promise<DocumentType<ProductModel>[]> {
		return this.productModel
			.aggregate([
				{
					$match: {
						title: {
							$regex: text,
							$options: 'i',
						},
					},
				},
			])
			.exec();
	}

	async findBySlug(dto: FindProductsDto): Promise<DocumentType<ProductModel>[]> {
		// return this.productModel.find({ categorySlug: dto.categorySlug }).exec();
		return this.productModel
			.aggregate([
				{
					$match: {
						categorySlug: dto.categorySlug,
					},
				},
				{
					$lookup: {
						from: 'Review',
						localField: '_id',
						foreignField: 'productId',
						as: 'reviews',
					},
				},
				{
					$addFields: {
						rating: { $avg: '$reviews.rating' },
					},
				},
				{
					$unset: 'reviews',
				},
			])
			.exec();
	}

	async findWithReviews(dto: FindProductDto) {
		return this.productModel
			.aggregate([
				{
					$match: {
						_id: new Types.ObjectId(dto.productId),
					},
				},
				{
					$sort: {
						_id: 1,
					},
				},
				{
					$lookup: {
						from: 'Review',
						localField: '_id',
						foreignField: 'productId',
						as: 'reviews',
					},
				},
				{
					$addFields: {
						reviewCount: { $size: '$reviews' },
						reviewAvg: { $avg: '$reviews.rating' },
					},
				},
			])
			.exec() as unknown as (ProductModel & {
			review: ReviewModel[];
			reviewCount: number;
			reviewAvg: number;
		})[];
	}
}
