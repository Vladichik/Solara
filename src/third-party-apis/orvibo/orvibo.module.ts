import { Module, HttpModule } from '@nestjs/common';
import { OrviboService } from './orvibo.service';
import { OrviboController } from './orvibo.controller';
import { CryptoGuyModule } from '../../tools/cryptoguy/cryptoguy.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule, CryptoGuyModule],
  providers: [OrviboService],
  controllers: [OrviboController],
})
export class OrviboModule {}
