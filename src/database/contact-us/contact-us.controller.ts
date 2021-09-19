import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('contact-us')
export class ContactUsController {
  constructor(private cuService: ContactUsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getUserDevices(@Res() res) {
    const contactInfo = this.cuService.getSolaraContactDetails();
    return res.status(HttpStatus.OK).json(contactInfo);
  }
}
