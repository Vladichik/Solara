import { Injectable, Logger } from '@nestjs/common';
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
  private allWeathers = [];
  private districts = [];
  private flowIndex = 0;
  private readonly logger = new Logger(CronService.name);

  @Cron(CronExpression.EVERY_30_SECONDS)
  async startCheckForWeatherHazards() {
    this.flowIndex = 0;
    this.allWeathers = [];
    this.districts = await this.devAddressesSrv.getAddressDistricts();
    if (this.districts && this.districts.length) {
      console.log('Flow started');
      await this.getWeatherForDistrict();
    }
    // if (process.env.NODE_ENV === 'production') {
    //
    // }
  }

  async getWeatherForDistrict() {
    if (this.districts[this.flowIndex]) {
      console.log(this.districts[this.flowIndex]);
      const weather = await this.weatherSrv.callWeatherAPI(
        `&q=${this.districts[this.flowIndex]}`,
      );
      if (weather) {
        weather.solara_district = this.districts[this.flowIndex];
        this.allWeathers.push(weather);
      }
      this.flowIndex += 1;
      await this.getWeatherForDistrict();
    } else if (this.allWeathers.length) {
      console.log(this.allWeathers);
    }
  }
}
