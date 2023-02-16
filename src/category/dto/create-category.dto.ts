import { IsString } from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';
export class CreateCategoryDto {
	@IsFile()
	@HasMimeType(['image/jpeg', 'image/png'])
	image: MemoryStoredFile;

	@IsString()
	title: string;

	@IsString()
	slug: string;
}
