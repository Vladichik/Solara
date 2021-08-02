/**
 * Written by vlad on 02/08/2021
 */
import { api } from 'boot/axios';
import AuthAPI from 'src/api/authentication';

const DEVICES_BASE = '/devices';

export default class DevicesAPI {
  /**
   * API call that fetches user devices from the server
   * @returns {Promise<T>}
   * Vlad. 02/08/21
   */
  static getMyDevices() {
    const userID = AuthAPI.getUserId();
    return api.get(`${DEVICES_BASE}/${userID}`)
      .then((resp) => resp)
      .catch((error) => error.response);
  }

  /**
   * API call that calls new device creation
   * @param device - Object with device details
   * @returns {Promise<T>}
   * Vlad. 02/08/21
   */
  static createDevice(device) {
    return api.post(`${DEVICES_BASE}/device`, device)
      .then((resp) => resp)
      .catch((error) => error.response);
  }
}
