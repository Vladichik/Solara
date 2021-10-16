import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DevicesService } from '../database/devices/devices.service';
import { DeviceAddressesService } from '../database/device-addresses/device-addresses.service';

@Injectable()
export class CronService {
  constructor(
    private readonly deviceService: DevicesService,
    private readonly devAddressesSrv: DeviceAddressesService,
  ) {}
  private readonly logger = new Logger(CronService.name);

  @Cron(CronExpression.EVERY_10_SECONDS)
  async checkWeatherConditionForHazards() {
    const devices = await this.devAddressesSrv.getAddressDistricts();
    console.log(devices);
    // if (process.env.NODE_ENV === 'production') {
    //
    // }
  }
}
