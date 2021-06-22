import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProgramHash } from './decorators';
import { ProgramsService } from './programs.service';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programService: ProgramsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllPrograms(@Req() request) {
    return this.programService.getAllPrograms(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('data')
  async getProgramNumberCalls(@ProgramHash() hash) {
    return await this.programService.getProgram(hash);
  }
}
