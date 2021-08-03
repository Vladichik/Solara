import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Device } from './device.interface';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel('Device')
    private deviceModel: Model<Device>,
  ) {}

  async getUserDevices(userID: ObjectId): Promise<Device[]> {
    return this.deviceModel.find({ user_id: userID }, { _v: 0 });
  }

  async createDevice(device: Partial<Device>): Promise<Device> {
    const newDevice = await new this.deviceModel(device);
    return newDevice.save();
  }

  async updateDevice(device: Partial<Device>): Promise<Device> {
    return this.deviceModel.findByIdAndUpdate({ _id: device.id }, device);
  }
}
