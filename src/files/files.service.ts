import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MemoryStoredFile } from 'nestjs-form-data';

@Injectable()
export class FilesService {
	async saveFile(file: MemoryStoredFile, folderName: string): Promise<string> {
		const uploadFolder = `${path}/uploads/${folderName}`;

		await ensureDir(uploadFolder);

		const buffer = await this.convertToWebP(file.buffer);
		await writeFile(`${uploadFolder}/${file.originalName}`, buffer);

		return `${folderName}/${file.originalName}`;
	}

	async convertToWebP(file: Buffer): Promise<Buffer> {
		return sharp(file).webp().toBuffer();
	}
}
