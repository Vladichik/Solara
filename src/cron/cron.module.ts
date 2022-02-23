import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { DevicesModule } from '../database/devices/devices.module';
import { DeviceAddressesModule } from '../database/device-addresses/device-addresses.module';
import { WeatherModule } from '../third-party-apis/weather/weather.module';

@Module({
  imports: [DevicesModule, DeviceAddressesModule, WeatherModule],
  providers: [CronService],
})
export class CronModule {}
