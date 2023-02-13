import { IsString, IsEnum, IsDate, IsNumber } from 'class-validator';
import { Sex } from '../user.model';

export class CreateUserDto {
	@IsString()
	login: string;

	@IsString()
	password: string;

	@IsString()
	phone: string;

	@IsDate()
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

	@IsNumber()
	card: number;
}
