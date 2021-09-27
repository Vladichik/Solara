/**
 * Written by vlad on 08/09/2021
 */
import { api } from 'boot/axios';

const WEATHER_BASE = '/weather';

export default class WeatherAPI {
  /**
   * API call that saves address or updates it
   * @returns
   * Vlad. 08/09/21
   */
  static getWeatherForDevice(payload) {
    return api.post(`${WEATHER_BASE}/get-current`, payload)
      .then((resp) => resp)
      .catch((error) => error.response);
  }
}
