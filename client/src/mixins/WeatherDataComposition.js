import { Constants } from 'src/config/constants';

export default function () {
  /**
   * Function that returns relevant weather background class
   * @returns {string}
   * Vlad. 22/11/21
   */
  const getWeatherBackgroundClass = (weather) => {
    if (weather.condition) {
      const isNight = weather.is_day === 0 ? '-night' : '';
      if (Constants.WEATHER_RAIN_CODES.includes(weather.condition.code)) {
        return `weather-rain${isNight}`;
      }
      if (Constants.WEATHER_SNOW_CODES.includes(weather.condition.code)) {
        return `weather-snow${isNight}`;
      }
      if (Constants.WEATHER_CLOUDS_CODES.includes(weather.condition.code)) {
        return `weather-clouds${isNight}`;
      }
      return `weather-clear${isNight}`;
    }
    return 'weather-clear';
  };

  return {
    getWeatherBackgroundClass,
  };
}
