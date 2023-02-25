import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { FilesService } from 'src/files/files.service';
import { CategoryModel } from './category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Types } from 'mongoose';

@Injectable()
export class CategoryService {
	constructor(
		@InjectModel(CategoryModel) private readonly categoryModel: ModelType<CategoryModel>,
		private readonly filesService: FilesService,
	) {}

	async create(dto: CreateCategoryDto): Promise<DocumentType<CategoryModel>> {
		const categoryId = new Types.ObjectId().toHexString();
		const imageUrl = await this.filesService.saveFile(dto.image, 'category', categoryId);
		const newCategory = new this.categoryModel({
			_id: categoryId,
			image: imageUrl,
			title: dto.title,
			slug: dto.slug,
			orderId: dto.orderId,
		});

		return newCategory.save();
	}

	async getAll(): Promise<DocumentType<CategoryModel>[]> {
		return this.categoryModel.find().exec();
	}

	async getBySlug(slug: string): Promise<DocumentType<CategoryModel> | null> {
		return this.categoryModel.findOne({ slug: slug }).exec();
	}

	async getById(id: string): Promise<DocumentType<CategoryModel> | null> {
		return this.categoryModel.findById(id).exec();
	}

	async updateById(
		id: string,
		dto: CreateCategoryDto,
	): Promise<DocumentType<CategoryModel> | null> {
		return this.categoryModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async delete(id: string): Promise<DocumentType<CategoryModel> | null> {
		return this.categoryModel.findByIdAndDelete(id).exec();
	}

	async findByText(text: string): Promise<DocumentType<CategoryModel>[]> {
		return this.categoryModel
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
}
