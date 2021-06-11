import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ProgramsService } from './programs.service';

@ApiTags('programs')
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('wasm'))
  uploadWASM(@UploadedFile() file, @Body() body) {
    return this.programsService.uploadProgram(file, body);
  }
}
