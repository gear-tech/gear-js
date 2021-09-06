import { Module } from '@nestjs/common';
import { IdeService } from './ide.service';
import { WsIdeGateway } from './ide-ws.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { GearNodeModule } from 'src/gear-node/gear-node.module';

@Module({
  imports: [AuthModule, UsersModule, GearNodeModule],
  providers: [IdeService, WsIdeGateway],
})
export class IdeModule {}
