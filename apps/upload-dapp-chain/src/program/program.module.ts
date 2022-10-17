import { Module } from "@nestjs/common";
import { ProgramService } from "./program.service";

@Module({
  controllers: [],
  providers: [ProgramService],
  exports: [ProgramService],
})
export class ProgramModule {}
