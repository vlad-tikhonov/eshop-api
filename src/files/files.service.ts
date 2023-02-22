import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MemoryStoredFile } from 'nestjs-form-data';

@Injectable()
export class FilesService {
	async saveFile(file: MemoryStoredFile, folderName: string, fileName: string): Promise<string> {
		const uploadFolder = `${path}/uploads/${folderName}`;

		await ensureDir(uploadFolder);

		const buffer = await this.convertToWebP(file.buffer);
		const newFileName = `${fileName}.webp`;
		// const newFileName = `${file.originalName.split('.')[0]}.webp`;

		await writeFile(`${uploadFolder}/${newFileName}`, buffer);

		return `${folderName}/${newFileName}`;
	}

	async convertToWebP(file: Buffer): Promise<Buffer> {
		return sharp(file).webp().toBuffer();
	}
}
