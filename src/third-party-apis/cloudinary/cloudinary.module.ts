import { Module } from '@nestjs/common';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { cloudinaryProvider } from './cloudinary.provider';

@Module({
  controllers: [CloudinaryController],
  providers: [cloudinaryProvider, CloudinaryService],
  exports: [cloudinaryProvider],
})
export class CloudinaryModule {}
