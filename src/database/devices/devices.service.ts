import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Device } from './device.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel('Device')
    private deviceModel: Model<Device>,
    private userSrv: UsersService,
  ) {}

  async getUserDevices(userID: ObjectId): Promise<Device[]> {
    return this.deviceModel
      .find({ user_id: userID }, { _v: 0 })
      .populate('address');
  }

  async createDevice(device: Partial<Device>): Promise<Device> {
    const newDevice = await new this.deviceModel(device);
    return newDevice.save();
  }

  async updateDevice(device: Partial<Device>): Promise<Device> {
    return this.deviceModel.findByIdAndUpdate({ _id: device.id }, device);
  }

  async getDeviceByDistricts(districts): Promise<Device[]> {
    const allDevices = await this.deviceModel.find().populate('address');
    if (allDevices && allDevices.length) {
      return allDevices.filter((device) =>
        // @ts-ignore
        districts.includes(device.address.district),
      );
    }
  }

  /**
   * Function that operates devices according to received hazardous weather data
   * Called by CRON task.
   * @param weatherData - Array with hazardous weather regions.
   * Vlad. 24/10/21
   */
  async operateDevicesAccordingToWeatherForecast(weatherData: Array<any>) {
    const districts = weatherData.map((d) => d.district);
    const devicesToOperate = await this.getDeviceByDistricts(districts);
    if (!devicesToOperate.length) {
      Logger.warn(
        'devices.service.ts -> operateDevicesAccordingToWeatherForecast quit: No devices to operate',
      );
      return;
    }
    const userIds = devicesToOperate.flatMap((d) => d.user_id);
    const relevantUsers = await this.userSrv.findUsers(userIds);
    const readyOperationalData = devicesToOperate.flatMap((device) => {
      const ownerUser = relevantUsers.find(
        (u) => u.id === device.user_id.toString(),
      );
      const district = weatherData.find(
        // @ts-ignore
        (d) => d.district === device.address.district,
      );
      return device.orvibo_ids.map((id) => ({
        part_id: id,
        action: district.action,
        user_id: ownerUser._id,
        orvibo_user_id: ownerUser.orvibo_id,
        token: ownerUser.orvibo_token,
        token_exp: ownerUser.orvibo_token_exp,
        refresh_token: ownerUser.orvibo_refresh_token,
      }));
    });
    await this.userSrv.checkUsersTokens(readyOperationalData);
    debugger;
  }
}
