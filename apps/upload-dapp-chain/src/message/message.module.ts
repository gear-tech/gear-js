import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";

@Module({
  controllers: [],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
