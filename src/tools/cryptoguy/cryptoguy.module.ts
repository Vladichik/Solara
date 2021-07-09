import { Module } from '@nestjs/common';
import { CryptoGuyService } from './cryptoguy.service';

@Module({
  providers: [CryptoGuyService],
  exports: [CryptoGuyService],
})
export class CryptoGuyModule {}
