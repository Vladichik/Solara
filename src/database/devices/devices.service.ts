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
    return this.deviceModel.find({ user_id: userID });
  }

  async createDevice(user: Partial<Device>): Promise<Device> {
    const newDevice = await new this.deviceModel(user);
    return newDevice.save();
  }
}
