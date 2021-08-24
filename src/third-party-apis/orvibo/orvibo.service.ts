import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { CryptoGuyService } from '../../tools/cryptoguy/cryptoguy.service';

@Injectable()
export class OrviboService {
  private readonly baseUrl: string;
  private readonly clientSecret: string;
  private readonly clientId: string;
  private readonly auth: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private cryptoService: CryptoGuyService,
  ) {
    this.baseUrl = configService.get<string>('ORVIBO_BASE_URL');
    this.clientId = configService.get<string>('ORVIBO_CLIENT_ID');
    this.clientSecret = configService.get<string>('ORVIBO_SECRET');
    this.auth = configService.get<string>('ORVIBO_AUTH');
  }

  async login(): Promise<AxiosResponse<any>> {
    const authParams = {
      requestId: '34234',
      namespace: 'Account.Login',
      version: 1,
      user: {
        account: 'nadav@patiocover.us',
        encryptPassword: '801UgiUnvuBRL1ai',
        encryptClientSecret: this.clientSecret,
        authentication: this.auth,
      },
      signInfo: {
        appID: this.clientId,
        sign: this.cryptoService.getSignHash('Account.Login+34234+', this.clientSecret),
        time: new Date(),
      },
    };
    console.log(authParams);
    const call = await this.httpService
      .post(`${this.baseUrl}`, authParams)
      .toPromise()
      .then((resp) => resp.data)
      .catch((e) => e);
    return call;
  }
}
