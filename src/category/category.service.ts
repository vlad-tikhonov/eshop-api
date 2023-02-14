import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CategoryModel } from './category.model';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
	constructor(@InjectModel(CategoryModel) private categoryModel: ModelType<CategoryModel>) {}

	async create(dto: CreateCategoryDto): Promise<DocumentType<CategoryModel>> {
		return this.categoryModel.create(dto);
	}

	async getAll(): Promise<DocumentType<CategoryModel>[]> {
		return this.categoryModel.find().exec();
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
}
