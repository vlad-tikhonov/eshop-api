import { IsString, IsEnum, IsDateString } from 'class-validator';
import { Sex } from '../user.model';

export class CreateUserDto {
	@IsString()
	login: string;

	@IsString()
	password: string;

	@IsString()
	phone: string;

	@IsDateString()
	birthDate: Date;

	@IsString()
	name: string;

	@IsString()
	surname: string;

	@IsEnum(Sex)
	sex: Sex;

	@IsString()
	region: string;

	@IsString()
	locality: string;

	@IsString()
	card: string;
}
