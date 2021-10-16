import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { DevicesModule } from '../database/devices/devices.module';
import { DeviceAddressesModule } from '../database/device-addresses/device-addresses.module';

@Module({
  imports: [DevicesModule, DeviceAddressesModule],
  providers: [CronService],
})
export class CronModule {}
