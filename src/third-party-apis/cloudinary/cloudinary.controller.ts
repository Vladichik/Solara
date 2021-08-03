import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/delete-image')
  async createCategory(@Res() res, @Body() publicID) {
    await this.cloudinaryService.deleteImage(publicID.id);
    return res.status(HttpStatus.OK).json(true);
  }
}
