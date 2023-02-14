import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserModel } from '../user/user.model';

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

	async validateUser(email: string, password: string): Promise<UserModel> {
		const user = await this.userService.findUser(email);

		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}

		const isCorrectPassword = await compare(password, user.passwordHash);

		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}

		return user;
	}

	async login(user: UserModel) {
		const payload = {
			email: user.email,
			name: user.name,
			surname: user.surname,
			birthDate: user.birthDate,
			sex: user.sex,
			region: user.region,
			locality: user.locality,
			card: user.card,
		};

		return {
			access_token: await this.jwtService.signAsync({ payload }),
		};
	}
}
