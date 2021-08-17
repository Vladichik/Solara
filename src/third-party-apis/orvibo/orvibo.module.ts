import { Module, HttpModule } from '@nestjs/common';
import { OrviboService } from './orvibo.service';
import { OrviboController } from './orvibo.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [OrviboService],
  controllers: [OrviboController],
})
export class OrviboModule {}
