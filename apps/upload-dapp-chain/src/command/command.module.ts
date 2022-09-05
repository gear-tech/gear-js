import { Module } from "@nestjs/common";

import { CommandService } from "./command.service";

@Module({
  controllers: [],
  providers: [CommandService],
  exports: [CommandService],
})
export class CommandModule {}
