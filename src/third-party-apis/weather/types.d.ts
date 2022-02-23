export interface WeatherParams {
  city: string;
  lat: number;
  long: number;
}

export interface ForecastResponse {
  forecast: any;
  location: any;
  current: any;
}

export interface AnalyzedWeather {
  district: string;
  condition: string;
  time: string;
  code: number;
  text: string;
  action: string;
}
