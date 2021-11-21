import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Device } from './device.interface';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel('Device')
    private deviceModel: Model<Device>,
    private userSrv: UsersService,
    private confSrv: ConfigService,
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
   * This function checks if relevant lock exists and still valid for specific
   * device. If so, device will be ignored and not be operated.
   * @param weatherData
   * @param devices
   * Vlad. 20/11/21
   */
  filterLockedDevices(weatherData: Array<any>, devices: Device[]) {
    return devices.filter((d) => {
      const district = weatherData.find(
        // @ts-ignore
        (w) => w.district === d.address.district,
      );
      return (
        !d[`lock_${district.condition.toLowerCase()}`] ||
        moment(district.time).isAfter(
          d[`lock_${district.condition.toLowerCase()}`],
        )
      );
    });
  }

  /**
   * Function that updates lock time of all devices which are going to be operated
   * @param weatherData
   * @param devices
   * Vlad. 21/11/21
   */
  async updateDevicesLockTimes(
    weatherData: Array<any>,
    devices: Device[],
  ): Promise<boolean> {
    if (devices && devices.length) {
      const devsToUpdate = JSON.parse(JSON.stringify(devices));
      devsToUpdate.forEach((device) => {
        const district = weatherData.find(
          // @ts-ignore
          (w) => w.district === device.address.district,
        );
        device[`lock_${district.condition.toLowerCase()}`] = moment(district.time)
          .add(
            this.confSrv.get<number>(`${district.condition}_LOCK_TIME`),
            'hours',
          )
          .format();
      });
      debugger;
      Logger.log(`Lock time updated for ${devsToUpdate.length} devices`);
      return true;
    }
    return true;
  }

  /**
   * Function that operates devices according to received hazardous weather data
   * Called by CRON task.
   * @param weatherData - Array with hazardous weather regions.
   * Vlad. 24/10/21
   */
  async operateDevicesAccordingToWeatherForecast(weatherData: Array<any>) {
    const districts = weatherData.map((d) => d.district);
    const devicesByDistricts = await this.getDeviceByDistricts(districts);
    if (!devicesByDistricts.length) {
      Logger.warn(
        'devices.service.ts -> operateDevicesAccordingToWeatherForecast quit: No devices to operate',
      );
      return;
    }
    const unlockedDevices = this.filterLockedDevices(
      weatherData,
      devicesByDistricts,
    );
    await this.updateDevicesLockTimes(weatherData, unlockedDevices);
    const userIds = unlockedDevices.flatMap((d) => d.user_id);
    const relevantUsers = await this.userSrv.findUsers(userIds);
    const readyOperationalData = unlockedDevices.flatMap((device) => {
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
        condition: district.condition,
        text: district.text,
        code: district.code,
        user_id: ownerUser._id,
        lock_snow: device.lock_snow,
        lock_rain: device.lock_rain,
        lock_wind: device.lock_wind,
        orvibo_user_id: ownerUser.orvibo_id,
        token: ownerUser.orvibo_token,
        token_exp: ownerUser.orvibo_token_exp,
        refresh_token: ownerUser.orvibo_refresh_token,
      }));
    });
    // We check the tokens of each relevant users to ensure
    // that commands that are sent to motors will be executed.
    // const validOperationalData = await this.userSrv.checkUsersTokens(
    //   readyOperationalData,
    // );
    // ======================================================//
    debugger;
  }
}
