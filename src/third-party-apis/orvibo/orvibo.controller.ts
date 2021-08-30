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
}
