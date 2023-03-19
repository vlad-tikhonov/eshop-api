import { prop } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';

export enum Sex {
	Male,
	Female,
}

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
	@prop({ unique: true })
	email: string;

	@prop()
	passwordHash: string;

	@prop()
	phone: string;

	@prop()
	birthDate: Date;

	@prop()
	surname: string;

	@prop()
	name: string;

	@prop({ enum: Sex })
	sex: Sex;

	@prop()
	region: string;

	@prop()
	locality: string;

	@prop()
	card: string;
}
