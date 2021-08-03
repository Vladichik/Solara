import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { DevicesService } from './devices.service';

@Controller('devices')
export class DevicesController {
  constructor(private deviceService: DevicesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:userID')
  async getUserDevices(@Res() res, @Param('userID') userID) {
    if (userID) {
      const devices = await this.deviceService.getUserDevices(userID);
      return res.status(HttpStatus.OK).json(devices);
    }
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'User ID was not supplied' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/device')
  async createDevice(@Res() res, @Body() payload) {
    const device = await this.deviceService.createDevice(payload);
    if (device && device._id) {
      return res.status(HttpStatus.OK).json(device);
    }
    return res
      .status(HttpStatus.NOT_IMPLEMENTED)
      .json({ message: 'Device creation failed' });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/device')
  async updateDevice(@Res() res, @Body() payload) {
    const device = await this.deviceService.updateDevice(payload);
    if (device && device._id) {
      return res.status(HttpStatus.OK).json(device);
    }
    return res
      .status(HttpStatus.NOT_IMPLEMENTED)
      .json({ message: 'Device update failed' });
  }
}
