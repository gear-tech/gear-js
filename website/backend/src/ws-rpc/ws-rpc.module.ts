import { Module } from '@nestjs/common';
import { MessagesModule } from 'src/messages/messages.module';
import { AuthModule } from 'src/auth/auth.module';
import { GearNodeModule } from 'src/gear-node/gear-node.module';
import { UsersModule } from 'src/users/users.module';
import { WsRpcGateway } from './ws-rpc.gateway';
import { WsRpcMessageHandler } from './ws-rpc.handler';
import { WsRpcMethods } from './ws-rpc.methods';
import { MetadataModule } from 'src/metadata/metadata.module';

@Module({
  imports: [GearNodeModule, UsersModule, AuthModule, MessagesModule, MetadataModule],
  providers: [WsRpcGateway, WsRpcMethods, WsRpcMessageHandler],
})
export class WsRpcModule {}
