import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';

@Injectable()
export class CryptoGuyService {
  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async verify(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  getSignHash(text: string, privateKey: string) {
    return crypto.createHmac('sha1', privateKey).update(text).digest('hex');
  }
}
