import { Module, HttpModule } from '@nestjs/common';
import { MapboxController } from './mapbox.controller';
import { MapboxService } from './mapbox.service';

@Module({
  imports: [HttpModule],
  controllers: [MapboxController],
  providers: [MapboxService],
})
export class MapboxModule {}
