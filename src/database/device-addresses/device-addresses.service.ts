import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, UpdateWriteOpResult } from 'mongoose';
import { DeviceAddress } from './device-address.interface';

@Injectable()
export class DeviceAddressesService {
  constructor(
    @InjectModel('AddressManual')
    private deviceAddressModel: Model<DeviceAddress>,
  ) {}

  async addAddress(address: DeviceAddress): Promise<DeviceAddress> {
    const newAddress = await new this.deviceAddressModel(address);
    return newAddress.save();
  }
}
