import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import MongoConfig from './config/mongo-config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './database/users/users.module';
import { CryptoGuyModule } from './tools/cryptoguy/cryptoguy.module';
import { MapboxModule } from './third-party-apis/mapbox/mapbox.module';
import configuration from './config/configurations';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist/spa'),
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useClass: MongoConfig,
    }),
    AuthModule,
    UsersModule,
    CryptoGuyModule,
    MapboxModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
