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
import { DeviceAddressesService } from './device-addresses.service';

@Controller('device-addresses')
export class DeviceAddressesController {
  constructor(private deviceAddressesService: DeviceAddressesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async addDeviceAddress(@Res() res, @Body() address) {
    const added = await this.deviceAddressesService.addAddress(address);
    if (added) {
      return res.status(HttpStatus.OK).json(added);
    }
    return res
      .status(HttpStatus.NOT_IMPLEMENTED)
      .json({ message: 'Address could not be saved' });
  }
}
