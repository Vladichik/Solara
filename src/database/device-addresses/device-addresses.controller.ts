import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { DeviceAddressesService } from './device-addresses.service';

@Controller('device-addresses')
export class DeviceAddressesController {
  constructor(private deviceAddressesService: DeviceAddressesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:userID')
  async getUserDevices(@Res() res, @Param('userID') userID) {
    if (userID) {
      const addresses = await this.deviceAddressesService.listDeviceAddresses(
        userID,
      );
      return res.status(HttpStatus.OK).json(addresses);
    }
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'User ID was not supplied' });
  }

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

  @UseGuards(JwtAuthGuard)
  @Delete('/:addressID')
  async deleteDeviceAddress(@Res() res, @Param('addressID') addressID) {
    if (addressID) {
      const devices = await this.deviceAddressesService.deleteAddress(
        addressID,
      );
      return res.status(HttpStatus.OK).json(devices);
    }
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Address ID was not supplied' });
  }
}
