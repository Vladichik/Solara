import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { MapboxService } from './mapbox.service';

@Controller('mapbox')
export class MapboxController {
  constructor(private mapBoxService: MapboxService) {}
  @Get('/address-suggestions/:text')
  async fetchAllCategories(@Res() res, @Param('text') text) {
    const suggestions = await this.mapBoxService.getAddressSuggestions(text);
    return res.status(HttpStatus.OK).json(suggestions);
  }
}
