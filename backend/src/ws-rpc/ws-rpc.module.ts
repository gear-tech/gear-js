import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GearNodeModule } from 'src/gear-node/gear-node.module';
import { UsersModule } from 'src/users/users.module';
import { WsRpcGateway } from './ws-rpc.gateway';
import { WsRpcMessageHandler } from './ws-rpc.handler';
import { WsRpcMethods } from './ws-rpc.methods';

@Module({
  imports: [GearNodeModule, UsersModule, AuthModule],
  providers: [WsRpcGateway, WsRpcMethods, WsRpcMessageHandler],
})
export class WsRpcModule {}
