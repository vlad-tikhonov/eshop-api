import { Injectable } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { genSalt, hash } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel, UserRoles } from './user.model';

@Injectable()
export class UserService {
	constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {}

	async createUser(dto: CreateUserDto): Promise<DocumentType<UserModel>> {
		const salt = await genSalt(10);
		const newUser = new this.userModel({
			email: dto.login,
			passwordHash: await hash(dto.password, salt),
			phone: dto.phone,
			birthDate: dto.birthDate,
			name: dto.name,
			surname: dto.surname,
			sex: dto.sex,
			region: dto.region,
			locality: dto.locality,
			card: dto.card,
			roles: [UserRoles.User],
		});

		return newUser.save();
	}

	async findUser(email: string): Promise<DocumentType<UserModel> | null> {
		return this.userModel.findOne({ email }).exec();
	}

	async findUserById(userId: string): Promise<DocumentType<UserModel> | null> {
		return this.userModel.findById(userId).exec();
	}
}
