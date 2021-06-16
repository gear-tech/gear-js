import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { GearNodeService } from './gear-node.service';

@Module({
  imports: [UsersModule],
  providers: [GearNodeService],
  exports: [GearNodeService],
})
export class GearNodeModule {}
