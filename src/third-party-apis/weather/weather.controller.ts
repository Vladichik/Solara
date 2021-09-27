import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/get-current')
  async getCurrentWeather(@Request() req, @Res() res, @Body() params) {
    const weather = await this.weatherService.getCurrentWeather(params);
    return res.status(HttpStatus.OK).json(weather);
  }
}
