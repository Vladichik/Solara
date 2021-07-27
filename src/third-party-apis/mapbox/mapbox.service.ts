import { Injectable, HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class MapboxService {
  constructor(private httpService: HttpService) {}

  getAddressSuggestions(text): Promise<AxiosResponse<any>> {
    return this.httpService
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=pk.eyJ1Ijoic2Nvcml0aSIsImEiOiJja2xxczh1aW4waTl2Mm5sbG5jYWtybTkwIn0.kYNYp1CEUjiroifspgKmcQ`,
      )
      .toPromise()
      .then((resp) => resp.data)
      .catch((e) => e);
  }
}
