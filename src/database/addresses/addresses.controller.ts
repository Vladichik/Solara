import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AddressesService } from './addresses.service';

@Controller('addresses')
export class AddressesController {
  constructor(private addressService: AddressesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/manual/:userID')
  async getUserDevices(@Res() res, @Param('userID') userID) {
    if (userID) {
      const devices =
        await this.addressService.queryManualAddressesByUser(userID);
      return res.status(HttpStatus.OK).json(devices);
    }
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'User ID was not supplied' });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/manual')
  async saveManualAddress(@Res() res, @Body() payload) {
    const address = await this.addressService.saveManualAddress(payload);
    if (address) {
      return res.status(HttpStatus.OK).json(address);
    }
    return res
      .status(HttpStatus.NOT_IMPLEMENTED)
      .json({ message: 'Address could not be saved' });
  }
}
