import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceSchema } from '../../schemas/device.schema';
import { DeviceAddressesModule } from '../device-addresses/device-addresses.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Device', schema: DeviceSchema }]),
    DeviceAddressesModule,
    UsersModule,
    ConfigModule,
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [DevicesService],
})
export class DevicesModule {}
