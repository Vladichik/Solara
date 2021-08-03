import {
  Body,
  Controller,
  Post,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async deleteImage(@Res() res, @Body() publicID) {
    await this.cloudinaryService.deleteImage(publicID.id);
    return res.status(HttpStatus.OK).json(true);
  }
}
