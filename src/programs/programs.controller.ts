import { Controller, Get } from '@nestjs/common';
import { ProgramsService } from './programs.service';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programService: ProgramsService) {}
  @Get('all')
  getAllPrograms() {
    return this.programService.getAllPrograms();
  }
}
