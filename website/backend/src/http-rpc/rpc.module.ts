import { Module } from '@nestjs/common';
import { GearNodeModule } from 'src/gear-node/gear-node.module';
import { HttpRpcMethods } from './rpc.methods';
import { RpcController } from './rpc.controller';
import { HttpRpcMessageHandler } from './rpc.handler';
import { ProgramsModule } from 'src/programs/programs.module';
import { MessagesModule } from 'src/messages/messages.module';
import { MetadataModule } from 'src/metadata/metadata.module';

@Module({
  imports: [GearNodeModule, ProgramsModule, MessagesModule, MetadataModule],
  providers: [HttpRpcMessageHandler, HttpRpcMethods],
  controllers: [RpcController],
})
export class RpcModule {}
