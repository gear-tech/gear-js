import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageService } from './storage.service';
import { Wasm } from './wasm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wasm]), Wasm],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
