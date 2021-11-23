import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DevicesService } from '../database/devices/devices.service';
import { DeviceAddressesService } from '../database/device-addresses/device-addresses.service';
import { WeatherService } from '../third-party-apis/weather/weather.service';

@Injectable()
export class CronService {
  constructor(
    private readonly deviceService: DevicesService,
    private readonly devAddressesSrv: DeviceAddressesService,
    private readonly weatherSrv: WeatherService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  startCheckForWeatherHazards() {
    // this.weatherSrv.startScheduledTaskForWeatherHazards().then();
    // if (process.env.NODE_ENV === 'production') {
    //
    // }
  }
}
