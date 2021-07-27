import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { MapboxService } from './mapbox.service';

@Controller('mapbox')
export class MapboxController {
  constructor(private mapBoxService: MapboxService) {}
  @Get('/address-suggestions/:addressString')
  async fetchAllCategories(@Res() res, @Param('addressString') addressString) {
    const suggestions = await this.mapBoxService.getAddressSuggestions(
      addressString,
    );
    return res.status(HttpStatus.OK).json(suggestions);
  }
}
