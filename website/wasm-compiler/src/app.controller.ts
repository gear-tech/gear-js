import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { StorageService } from './storage/storage.service';
import { generateId, unpackZip } from './util';

@Controller('wasm-compiler')
export class AppController {
  constructor(private readonly appService: AppService, private readonly storageService: StorageService) {}

  @Post('build')
  @UseInterceptors(FileInterceptor('file'))
  async build(@UploadedFile() file) {
    const id = generateId();
    const path = unpackZip(file.buffer, id);
    this.appService.processBuild(path, id);
    return { id: id };
  }

  @Post('get-wasm')
  async getWasm(@Body() body: { id: string }) {
    return await this.storageService.getFile(body.id);
  }
}
