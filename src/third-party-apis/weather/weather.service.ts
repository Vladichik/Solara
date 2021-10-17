import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherParams } from './types';
import { DeviceAddressesService } from '../../database/device-addresses/device-addresses.service';

@Injectable()
export class WeatherService {
  private readonly weatherSecret: string;
  private readonly weatherUrl: string;
  private allWeathers = [];
  private flowIndex = 0;
  private districts = [];

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private deviceAddressSrv: DeviceAddressesService,
  ) {
    this.weatherSecret = configService.get<string>('WEATHER_API_SECRET');
    this.weatherUrl = configService.get<string>('WEATHER_API_URL');
  }

  /**
   * Function that receives params for weather query and call Weather API
   * @param params - String
   * Vlad. 08/09/21
   */
  callWeatherAPI(params: any): Promise<any> {
    return this.httpService
      .get(`${this.weatherUrl}?key=${this.weatherSecret}${params}&aqi=no`)
      .toPromise()
      .then((resp) => resp.data)
      .catch((e) => e);
  }

  async getCurrentWeather(params: Partial<WeatherParams>): Promise<any> {
    let p = `&q=${params.city}`;
    if (!params.city || !params.city.length) {
      p = `&q=${params.lat},${params.long}`;
    }
    return await this.callWeatherAPI(p);
  }

  /**
   * Task that starts every planned time to check weather conditions
   * and hazards data, in order to set the Devices to safe position
   * Vlad. 17/10/21
   */
  async startScheduledTaskForWeatherHazards() {
    this.districts = await this.deviceAddressSrv.getAddressDistricts();
    if (this.districts && this.districts.length) {
      await this.getWeatherForDistrict();
    }
  }

  /**
   * Function that gets weather condition for relevant district and puts it
   * into allWeathers array.
   * Vlad. 16/10/21
   */
  async getWeatherForDistrict() {
    if (this.districts[this.flowIndex]) {
      console.log(this.districts[this.flowIndex]);
      const weather = await this.callWeatherAPI(
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
