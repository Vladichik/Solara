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

  /**
   * Function that groups all addresses by districts and returns
   * array of existing districts. Functionality needed for scheduled
   * weather task
   * Vlad. 16/10/21
   */
  async getAddressDistricts(): Promise<Array<any>> {
    const districts = await this.deviceAddressModel.aggregate([
      { $group: { _id: '$district' } },
    ]);
    if (districts.length) {
      return districts?.map((district) => district._id);
    }
    return [];
  }

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
