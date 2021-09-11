import { Injectable, HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { WeatherParams } from './types';

@Injectable()
export class WeatherService {
  private readonly weatherSecret: string;
  private readonly weatherUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
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
}
