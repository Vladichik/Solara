import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';

@Injectable()
export class CryptoGuyService {
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
}
