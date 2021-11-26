import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { ProgramsModule } from './programs/programs.module';
import { GearNodeModule } from './gear-node/gear-node.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RpcModule } from './http-rpc/rpc.module';
import { IdeModule } from './ide/ide.module';
import { MessagesModule } from './messages/messages.module';
import { MetadataModule } from './metadata/metadata.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('db.host'),
        port: +configService.get<number>('db.port'),
        username: configService.get('db.user'),
        password: configService.get('db.password'),
        database: configService.get('db.name'),
        autoLoadEntities: true,
        synchronize: true,
        entities: ['dist/**/*.entity.js'],
      }),
      inject: [ConfigService],
    }),
    ProgramsModule,
    GearNodeModule,
    EventEmitterModule.forRoot(),
    RpcModule,
    IdeModule,
    MessagesModule,
    MetadataModule,
  ],
})
export class AppModule {}
