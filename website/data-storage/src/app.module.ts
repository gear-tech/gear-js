import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConsumerModule } from './consumer/consumer.module';
import { MessagesModule } from './messages/messages.module';
import { MetadataModule } from './metadata/metadata.module';
import { ProgramsModule } from './programs/programs.module';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import configurations from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurations],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        autoLoadEntities: true,
        synchronize: true,
        entities: ['dist/**/*.entity.js'],
      }),
      inject: [ConfigService],
    }),
    ConsumerModule,
    ProgramsModule,
    MessagesModule,
    MetadataModule,
    HealthcheckModule,
  ],
  controllers: [HealthcheckController],
})
export class AppModule {}
