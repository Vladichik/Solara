import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto-js';

@Injectable()
export class CryptoGuyService {
  // constructor(private configService: ConfigService) {}
  // password = this.configService.get<string>('PASS_SECRET');
  password: string;

  constructor(private configService: ConfigService) {
    this.password = this.configService.get<string>('PASS_SECRET');
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async verify(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  getSignHash(text: string) {
    return createHash('sha1').update(text).digest('hex');
  }

  async encrypt(data: string) {
    return crypto.AES.encrypt(data, this.password).toString();
  }

  async decrypt(encrypted: string) {
    return crypto.AES.decrypt(encrypted, this.password).toString(
      crypto.enc.Utf8,
    );
  }
}
