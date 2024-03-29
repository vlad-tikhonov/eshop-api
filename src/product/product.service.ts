import { Injectable } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CategoryService } from 'src/category/category.service';
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
		private readonly categoryService: CategoryService,
	) {}

	async create(dto: CreateProductDto): Promise<DocumentType<ProductModel> | null> {
		const productId = new Types.ObjectId().toHexString();

		const imageUrl = await this.filesService.saveFile(dto.image, 'product', productId);
		const category = await this.categoryService.getById(dto.categoryId);

		if (!category) {
			return null;
		}

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
			categoryTitle: category?.title,
			categorySlug: category?.slug,
			tags: dto.tags,
			code: dto.code,
			slug: dto.slug,
		});

		return newProduct.save();
	}

	async findById(productId: string): Promise<DocumentType<ProductModel> | null> {
		return this.productModel.findById(productId).exec();
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

	async findByText(
		text: string,
	): Promise<
		DocumentType<{ _id: Types.ObjectId; title: string; categorySlug: string; slug: string }>[]
	> {
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
				{
					$project: {
						_id: 1,
						title: 1,
						categorySlug: 1,
						slug: 1,
					},
				},
			])
			.exec();
	}

	async findByCategorySlug(dto: FindProductsDto): Promise<DocumentType<ProductModel>[]> {
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
						reviewsAvg: { $avg: '$reviews.rating' },
					},
				},
				{
					$unset: 'reviews',
				},
			])
			.exec();
	}

	async getBySlug(slug: string) {
		return this.productModel
			.aggregate([
				{
					$match: {
						slug,
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
					$lookup: {
						from: 'Product',
						let: { slug: '$slug' },
						pipeline: [
							{
								$match: {
									slug: {
										$not: {
											$eq: slug,
										},
									},
								},
							},
							{
								$limit: 4,
							},
						],
						as: 'relatedProducts',
					},
				},
				{
					$addFields: {
						reviewsCount: { $size: '$reviews' },
						reviewsAvg: { $avg: '$reviews.rating' },
					},
				},
				{
					$unset: 'reviews',
				},
			])
			.exec() as unknown as (ProductModel & {
			relatedProducts: ProductModel[];
			reviewsCount: number;
			reviewsAvg: number;
		})[];
	}

	async findWithReviewsInfo(dto: FindProductDto) {
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
						reviewsCount: { $size: '$reviews' },
						reviewsAvg: { $avg: '$reviews.rating' },
					},
				},
				{
					$unset: 'reviews',
				},
			])
			.exec() as unknown as (ProductModel & {
			review: ReviewModel[];
			reviewsCount: number;
			reviewsAvg: number;
		})[];
	}

	async getPromotions() {
		return this.productModel.aggregate([
			{
				$match: {
					discount: {
						$ne: null,
					},
				},
			},
			{
				$sample: { size: 4 },
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
					reviewsAvg: { $avg: '$reviews.rating' },
				},
			},
			{
				$unset: 'reviews',
			},
		]);
	}

	async getNovelties() {
		return this.productModel.aggregate([
			{
				$sample: { size: 4 },
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
					reviewsAvg: { $avg: '$reviews.rating' },
				},
			},
			{
				$unset: 'reviews',
			},
		]);
	}
}
