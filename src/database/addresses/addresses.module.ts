import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressManualSchema } from '../../schemas/address.manual.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AddressManual', schema: AddressManualSchema },
    ]),
  ],
  providers: [AddressesService],
  controllers: [AddressesController],
  exports: [AddressesService],
})
export class AddressesModule {}
