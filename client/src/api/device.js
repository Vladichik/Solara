/**
 * Written by vlad on 02/08/2021
 */
import { api } from 'boot/axios';

const DEVICES_BASE = '/devices/device';

export default class DevicesAPI {
  /**
   * API call that calls new device creation
   * @param device - Object with device details
   * @returns {Promise<T>}
   * Vlad. 02/08/21
   */
  static createDevice(device) {
    return api.post(DEVICES_BASE, device)
      .then((resp) => resp)
      .catch((error) => error.response);
  }
}
