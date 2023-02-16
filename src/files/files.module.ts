import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';
import { FilesService } from './files.service';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/static',
		}),
	],
	exports: [FilesService],
	providers: [FilesService],
})
export class FilesModule {}
