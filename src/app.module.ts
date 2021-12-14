import { Module } from '@nestjs/common';
import MongoConfig from './config/mongo-config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './database/users/users.module';
import { CryptoGuyModule } from './tools/cryptoguy/cryptoguy.module';
import { MapboxModule } from './third-party-apis/mapbox/mapbox.module';
import { DevicesModule } from './database/devices/devices.module';
import { CloudinaryModule } from './third-party-apis/cloudinary/cloudinary.module';
import { AddressesModule } from './database/addresses/addresses.module';
import { DeviceAddressesModule } from './database/device-addresses/device-addresses.module';
import { OrviboModule } from './third-party-apis/orvibo/orvibo.module';
import { WeatherModule } from './third-party-apis/weather/weather.module';
import { ContactUsModule } from './database/contact-us/contact-us.module';
import { MailerModule } from '@nestjs-modules/mailer';
import configuration from './config/configurations';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist/spa'),
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useClass: MongoConfig,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: process.env.EMAIL_TRANSPORT, // configService.get<string>('EMAIL_TRANSPORT'),
        port: process.env.EMAIL_PORT, // configService.get<string>('EMAIL_PORT'),
        defaults: {
          from: process.env.COMPANY_EMAIL, //configService.get<string>('EMAIL_SOLARA'),
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    CronModule,
    AuthModule,
    UsersModule,
    CryptoGuyModule,
    MapboxModule,
    DevicesModule,
    CloudinaryModule,
    AddressesModule,
    DeviceAddressesModule,
    OrviboModule,
    WeatherModule,
    ContactUsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
