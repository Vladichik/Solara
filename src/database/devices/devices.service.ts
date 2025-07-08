import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Device } from './device.interface';
import { User } from '../users/user.interface';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { OrviboService } from '../../third-party-apis/orvibo/orvibo.service';
import * as moment from 'moment';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel('Device')
    private deviceModel: Model<Device>,
    private userSrv: UsersService,
    private confSrv: ConfigService,
    private orviboSrv: OrviboService,
  ) {}

  private cronOperationIndex = 0;
  timeout = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
   * Function that returns ready locks object to be updated
   * in DB.
   * @param condition
   * @param time
   * Vlad. 21/11/21
   */
  generateLockUpdateObject(
    condition: string,
    time: string,
  ): Record<symbol, string> {
    switch (condition) {
      case 'SNOW':
        // @ts-ignore
        return { lock_snow: new Date(time) };
      case 'RAIN':
        // @ts-ignore
        return { lock_rain: new Date(time) };
      case 'WIND':
        // @ts-ignore
        return { lock_wind: new Date(time) };
    }
  }

  /**
   * Function that updates lock time of all devices which are going to be operated
   * @param weatherData
   * @param devices
   * @param users
   * Vlad. 21/11/21
   */
  async updateDevicesLockTimes(
    weatherData: Array<any>,
    devices: Device[],
    users: User[],
  ): Promise<boolean> {
    if (devices && devices.length) {
      const bulks = [];

      // Getting Ids of PRO users only
      const proUsers = users
        .filter((u) => u.is_pro && u.smart_active)
        .map((o) => o._id.toString());

      // Filtering devices by PRO users, since only PRO user's devices must be updated
      const devsToUpdate = devices.filter((d) =>
        proUsers.includes(d.user_id.toString()),
      );

      devsToUpdate.forEach((device) => {
        const district = weatherData.find(
          // @ts-ignore
          (w) => w.district === device.address.district,
        );
        const timeToAdd = this.confSrv.get<number>(
          `${district.condition}_LOCK_TIME`,
        );
        const updatedTime = moment(district.time)
          .add(timeToAdd, 'hours')
          .format();
        bulks.push({
          updateOne: {
            filter: { _id: device._id },
            update: this.generateLockUpdateObject(
              district.condition,
              updatedTime,
            ),
          },
        });
      });
      await this.deviceModel.bulkWrite(bulks);
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
    const userIds = unlockedDevices.flatMap((d) => d.user_id);
    const relevantUsers = await this.userSrv.findUsers(userIds);

    // Here we update lock times for relevant users
    await this.updateDevicesLockTimes(
      weatherData,
      unlockedDevices,
      relevantUsers,
    );

    const readyOperationalData = [];
    unlockedDevices.flatMap((device) => {
      const ownerUser = relevantUsers.find(
        (u) => u.id === device.user_id.toString(),
      );
      const district = weatherData.find(
        // @ts-ignore
        (d) => d.district === device.address.district,
      );
      if (ownerUser?.is_pro && ownerUser.smart_active) {
        device.orvibo_ids.forEach((id) => {
          readyOperationalData.push({
            deviceId: id,
            action: district.action,
            condition: district.condition,
            text: district.text,
            code: district.code,
            user_id: ownerUser._id,
            lock_snow: device.lock_snow,
            lock_rain: device.lock_rain,
            lock_wind: device.lock_wind,
            orvibo_user_id: ownerUser.orvibo_id,
            access_token: ownerUser.orvibo_token,
            token_exp: ownerUser.orvibo_token_exp,
            refresh_token: ownerUser.orvibo_refresh_token,
          });
        });
      }
    });
    if (readyOperationalData && readyOperationalData.length) {
      this.cronOperationIndex = 0;
      this.operateDeviceInOrvibo(readyOperationalData).then();
    } else {
      Logger.log(
        'Weather hazard exist, but there are no required device to operate',
      );
    }
  }

  /**
   * Function that called by cron task which send command to device.
   * @param devices - Array of devices that should be operated
   * Vlad. 05/12/21
   */
  async operateDeviceInOrvibo(devices: any[]) {
    this.orviboSrv.sendCommandToDevice(devices[this.cronOperationIndex]).then();
    Logger.log(`${devices[this.cronOperationIndex].action} device`);
    await this.timeout(2000);
    this.cronOperationIndex++;
    if (devices[this.cronOperationIndex]) {
      this.operateDeviceInOrvibo(devices).then();
    }
  }
}
