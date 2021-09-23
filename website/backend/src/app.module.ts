import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/configuration';
import { ProgramsModule } from './programs/programs.module';
import { GearNodeModule } from './gear-node/gear-node.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WsRpcModule } from './ws-rpc/ws-rpc.module';
import { RpcModule } from './http-rpc/rpc.module';
// import { TelegrafModule } from 'nestjs-telegraf';
// import { TelegramModule } from './telegram/telegram.module';
import { IdeModule } from './ide/ide.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        entities: ['dist/**/*.entity.js'],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProgramsModule,
    GearNodeModule,
    EventEmitterModule.forRoot(),
    RpcModule,
    WsRpcModule,
    // TelegrafModule.forRoot({
    //   token: process.env.TELEGRAM_BOT_TOKEN,
    //   include: [TelegramModule],
    // }),
    // TelegramModule,
    IdeModule,
    MessagesModule,
  ],
})
export class AppModule {}
