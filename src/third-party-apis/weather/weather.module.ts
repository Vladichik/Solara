import { HttpModule, Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { ConfigModule } from '@nestjs/config';
import { DeviceAddressesModule } from '../../database/device-addresses/device-addresses.module';

@Module({
  imports: [HttpModule, ConfigModule, DeviceAddressesModule],
  providers: [WeatherService],
  controllers: [WeatherController],
  exports: [WeatherService],
})
export class WeatherModule {}
