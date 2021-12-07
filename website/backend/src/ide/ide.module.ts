import { Module } from '@nestjs/common';
import { IdeService } from './ide.service';
import { WsIdeGateway } from './ide-ws.gateway';
import { UsersModule } from 'src/users/users.module';
import { GearNodeModule } from 'src/gear-node/gear-node.module';

@Module({
  imports: [UsersModule, GearNodeModule],
  providers: [IdeService, WsIdeGateway],
})
export class IdeModule {}
