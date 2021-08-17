import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrviboService {
  private readonly baseUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.baseUrl = configService.get<string>('ORVIBO_BASE_URL');
  }

  async login(): Promise<AxiosResponse<any>> {
    const call = await this.httpService
      .post(`${this.baseUrl}`)
      .toPromise()
      .then((resp) => resp.data)
      .catch((e) => e);
    return call;
  }
}
