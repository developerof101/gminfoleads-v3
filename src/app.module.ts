import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SystemUsersModule } from './modules/system-users/system-users.module';
import { SystemRolesModule } from './modules/system-roles/system-roles.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { FtpModule } from './modules/ftp/ftp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test'),
        PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string().empty(''),
        DB_DATABASE: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        synchronize: true,
        logging: false,
        logger: 'advanced-console',
        timezone: '-05:00',
        keepConnectionAlive: configService.get<string>('NODE_ENV') === 'test',
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'es',
      loaderOptions: {
        path: path.join(__dirname, '/i18n'),
      },
      resolvers: [new QueryResolver(['lang', 'language'])],
    }),
    AuthModule,
    SystemUsersModule,
    SystemRolesModule,
    UploadsModule,
    TasksModule,
    FtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
