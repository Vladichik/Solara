import { Module } from '@nestjs/common';
import { DeviceAddressesService } from './device-addresses.service';
import { DeviceAddressesController } from './device-addresses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesAddressSchema } from '../../schemas/devices-address.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DeviceAddress', schema: DevicesAddressSchema },
    ]),
  ],
  providers: [DeviceAddressesService],
  controllers: [DeviceAddressesController],
  exports: [DeviceAddressesService],
})
export class DeviceAddressesModule {}
