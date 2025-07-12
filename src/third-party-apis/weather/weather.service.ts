import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { WeatherParams, ForecastResponse, AnalyzedWeather } from './types';
import { DeviceAddressesService } from '../../database/device-addresses/device-addresses.service';
import { DevicesService } from '../../database/devices/devices.service';
import * as moment from 'moment';

@Injectable()
export class WeatherService {
  private readonly weatherSecret: string;
  private readonly weatherUrl: string;
  private readonly snowCodes: number[];
  private readonly rainCodes: number[];
  private readonly maxWindSpeed: number;
  private readonly actOn: string;
  private readonly actOff: string;
  private allWeathers = [];
  private flowIndex = 0;
  private districts = [];

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private deviceAddressSrv: DeviceAddressesService,
    private devicesSrv: DevicesService,
  ) {
    this.weatherSecret = configService.get<string>('WEATHER_API_SECRET');
    this.weatherUrl = configService.get<string>('WEATHER_API_URL');
    this.snowCodes = configService.get<number[]>('WEATHER_SNOW_CODES');
    this.rainCodes = configService.get<number[]>('WEATHER_RAIN_CODES');
    this.maxWindSpeed = configService.get<number>('WEATHER_MAX_WIND');
    this.actOn = configService.get<string>('ORVIBO_ACT_ON');
    this.actOff = configService.get<string>('ORVIBO_ACT_OFF');
  }

  /**
   * Function that assembles the url for relevant weather request.
   * @param params - String, required url params for weather query
   * @param type - The weather type query (Current weather/Forecast/ etc.)
   * // For more details please check https://www.weatherapi.com/docs/
   */
  assembleApiEndEndpoint(params, type) {
    return `${this.weatherUrl}${type}.json?key=${this.weatherSecret}${params}&aqi=no`;
  }

  /**
   * Function that receives params for weather query and call Weather API
   * @param type - String, key to API assembler
   * @param params - String
   * Vlad. 08/09/21
   */
  callWeatherAPI(params: any, type = 'current'): Promise<any> {
    const url = this.assembleApiEndEndpoint(params, type);
    return this.httpService
      .get(url)
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
    this.flowIndex = 0;
    this.allWeathers = [];
    this.districts = await this.deviceAddressSrv.getAddressDistricts();
    Logger.log(`Districts ${this.districts?.length}`);
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
    Logger.log(this.districts[this.flowIndex]);
    if (this.districts[this.flowIndex]) {
      const forecast = await this.callWeatherAPI(
        `&q=${this.districts[this.flowIndex]}&aqi=no&alerts=no`,
        'forecast',
      );
      const analyzedForecast = this.analyzeForecast(forecast);
      if (analyzedForecast && analyzedForecast.code) {
        analyzedForecast.district = this.districts[this.flowIndex];
        this.allWeathers.push(analyzedForecast);
      }
      this.flowIndex += 1;
      await this.getWeatherForDistrict();
    } else if (this.allWeathers.length) {
      Logger.log(`Operation made for ${this.allWeathers.length} regions`);
      Logger.log(this.allWeathers);
      await this.devicesSrv.operateDevicesAccordingToWeatherForecast(
        this.allWeathers,
      );
    } else {
      const date = moment().format('HH:mm DD/MM/YYYY');
      Logger.log(`No weather hazards found at ${date}`);
    }
  }

  /**
   * Function that analyzes received forecast and returns relevant data object
   * in case forecast has hazardous weather conditions
   * @param forecast
   * Vlad. 18/10/21
   */
  analyzeForecast(forecast: ForecastResponse): Partial<AnalyzedWeather> {
    if (forecast.forecast && forecast.forecast.forecastday) {
      const forecastData = forecast.forecast.forecastday[0].hour;
      const d = new Date(forecast.location.localtime);
      const hour = moment(d).add(1, 'hours').get('hour');
      if (!forecastData || !forecastData.length) return {};
      const relForecast = forecastData.find((h) => h.time.includes(`${hour}:`));
      if (!relForecast) return {};
      if (this.snowCodes.includes(relForecast.condition.code)) {
        return {
          code: relForecast.condition.code,
          text: relForecast.condition.text,
          time: relForecast.time,
          condition: 'SNOW',
          action: this.actOff,
        };
      }
      if (this.rainCodes.includes(relForecast.condition.code)) {
        return {
          code: relForecast.condition.code,
          text: relForecast.condition.text,
          time: relForecast.time,
          condition: 'RAIN',
          action: this.actOff,
        };
      }
      if (relForecast.wind_mph >= this.maxWindSpeed) {
        return {
          code: relForecast.condition.code,
          text: relForecast.condition.text,
          time: relForecast.time,
          condition: 'WIND',
          action: this.actOn,
        };
      }
      // if (relForecast.is_day === 1 ) {
      //
      // }
    }
    return {};
  }
}
