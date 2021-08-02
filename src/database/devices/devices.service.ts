import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device } from './device.interface';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel('Device')
    private deviceModel: Model<Device>,
  ) {}

  async createDevice(user: Partial<Device>): Promise<Device> {
    const newDevice = await new this.deviceModel(user);
    return newDevice.save();
  }
}
