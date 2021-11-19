import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CryptoGuyModule } from '../../tools/cryptoguy/cryptoguy.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OrviboModule } from '../../third-party-apis/orvibo/orvibo.module';
import { UserSchema } from '../../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    CryptoGuyModule,
    OrviboModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
