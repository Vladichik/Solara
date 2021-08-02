import {
  Body,
  Controller,
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
}
