import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferBalance } from './transfer.entity';
import { DbService } from './db.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransferBalance]), TransferBalance],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
