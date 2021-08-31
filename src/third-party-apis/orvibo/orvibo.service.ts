import { v4 as uuidv4 } from 'uuid';
import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { OrviboDeviceQueryProps } from './types';
import { CryptoGuyService } from '../../tools/cryptoguy/cryptoguy.service';

@Injectable()
export class OrviboService {
  private readonly authUrl: string;
  private readonly baseUrl: string;
  private readonly clientSecret: string;
  private readonly clientId: string;
  private readonly auth: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private cryptoService: CryptoGuyService,
  ) {
    this.authUrl = configService.get<string>('ORVIBO_AUTH_URL');
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
        `${this.authUrl}?grant_type=authorization_code&client_id=${this.clientId}&client_secret=${this.clientSecret}&code=${credentials.code}&redirect_uri=http://localhost:8082/`,
      )
      // .post(`${this.baseUrl}`, authParams)
      .toPromise()
      .then((resp) => resp.data)
      .catch((e) => e);
  }

  async getUserDevices(props: OrviboDeviceQueryProps): Promise<any> {
    const namespace = 'Device.Discovery';
    const requestId = uuidv4();
    const time = Math.floor(new Date().getTime() / 1000);
    const payload = {
      namespace: namespace,
      requestId: requestId,
      version: 1,
      accessToken: props.access_token,
      signInfo: {
        appId: this.clientId,
        sign: this.cryptoService.getSignHash(
          `${namespace}${requestId}1${props.access_token}${time}${this.clientSecret}`,
        ),
        time: time,
      },
    };
    const call = await this.httpService
      .post(this.baseUrl, payload)
      .toPromise()
      .then((resp) => resp.data)
      .catch((e) => e);
    return call;
  }
}
