import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrviboService {
  private readonly baseUrl: string;
  private readonly clientSecret: string;
  private readonly clientId: string;
  private readonly auth: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.baseUrl = configService.get<string>('ORVIBO_BASE_URL');
    this.clientId = configService.get<string>('ORVIBO_CLIENT_ID');
    this.clientSecret = configService.get<string>('ORVIBO_SECRET');
    this.auth = configService.get<string>('ORVIBO_AUTH');
  }

  /**
   * Function that receives authentication code from client side and performs
   * authentication in Orvibo Cloud
   * @param credentials - object that contains code
   * Vlad. 28/08/21
   */
  async login(credentials: any): Promise<AxiosResponse<any>> {
    return await this.httpService
      .get(
        `${this.baseUrl}oauth/token?grant_type=authorization_code&client_id=${this.clientId}&client_secret=${this.clientSecret}&code=${credentials.code}&redirect_uri=http://localhost:8082/`,
      )
      // .post(`${this.baseUrl}`, authParams)
      .toPromise()
      .then((resp) => resp.data)
      .catch((e) => e);
  }
}
