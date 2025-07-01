import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { ConfigModule } from '@nestjs/config';
import { DeviceAddressesModule } from '../../database/device-addresses/device-addresses.module';
import { DevicesModule } from '../../database/devices/devices.module';

@Module({
  imports: [HttpModule, ConfigModule, DeviceAddressesModule, DevicesModule],
  providers: [WeatherService],
  controllers: [WeatherController],
  exports: [WeatherService],
})
export class WeatherModule {}
