import {
  Body,
  Controller,
  HttpStatus,
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
