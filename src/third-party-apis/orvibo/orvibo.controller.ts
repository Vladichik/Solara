import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { OrviboService } from './orvibo.service';

@Controller('orvibo')
export class OrviboController {
  constructor(private orviboService: OrviboService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/login')
  async login(@Request() req, @Body() credentials) {
    return await this.orviboService.login(credentials);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/get-devices')
  async getUserDevices(@Request() req, @Res() res, @Body() credentials) {
    const devices = await this.orviboService.getUserDevices(credentials);
    return res.status(HttpStatus.OK).json(devices);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/operate-device')
  async sendDeviceCommand(@Request() req, @Res() res, @Body() command) {
    const sent = await this.orviboService.sendCommandToDevice(command);
    Logger.log('========= RESPONSE FROM ORVIBO ON COMMAND ==========');
    Logger.log(sent);
    Logger.log('====================================================');
    return res.status(HttpStatus.OK).json(sent);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/refresh-token')
  async refreshClientToken(@Request() req, @Res() res, @Body() payload) {
    const sent = await this.orviboService.refreshToken(payload);
    return res.status(HttpStatus.OK).json(sent);
  }
}
