import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MapboxController } from './mapbox.controller';
import { MapboxService } from './mapbox.service';

@Module({
  imports: [HttpModule],
  controllers: [MapboxController],
  providers: [MapboxService],
})
export class MapboxModule {}
