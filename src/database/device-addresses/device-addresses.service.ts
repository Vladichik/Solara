import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { DeviceAddress } from './device-address.interface';

@Injectable()
export class DeviceAddressesService {
  constructor(
    @InjectModel('DeviceAddress')
    private deviceAddressModel: Model<DeviceAddress>,
  ) {}

  async listDeviceAddresses(userID: ObjectId): Promise<DeviceAddress[]> {
    return this.deviceAddressModel.find({ user_id: userID }).exec();
  }

  async addAddress(address: DeviceAddress): Promise<DeviceAddress> {
    const newAddress = await new this.deviceAddressModel(address);
    return newAddress.save();
  }

  async deleteAddress(addressID: ObjectId): Promise<DeviceAddress> {
    return this.deviceAddressModel.findByIdAndDelete(addressID);
  }
}
