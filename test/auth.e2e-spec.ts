import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '../src/auth/auth.constants';

const loginDto: AuthDto = {
	login: 'a@a.ru',
	password: '1',
};

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let accessToken: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/login (POST) - success', (done) => {
		request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				accessToken = body.access_token;
				expect(accessToken).toBeDefined();
				done();
			});
	});

	it('/auth/login (POST) - failure: wrong password', (done) => {
		request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, password: '2' })
			.expect(401)
			.then(({ body }: request.Response) => {
				const message = body.message;
				expect(message).toBe(WRONG_PASSWORD_ERROR);
				done();
			});
	});

	it('/auth/login (POST) - failure: wrong login', (done) => {
		request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, login: 'some login' })
			.expect(401)
			.then(({ body }: request.Response) => {
				const message = body.message;
				expect(message).toBe(USER_NOT_FOUND_ERROR);
				done();
			});
	});

	afterAll(() => {
		disconnect();
	});
});
