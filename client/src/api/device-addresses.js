/**
 * Written by vlad on 09/08/2021
 */
import { api } from 'boot/axios';
import AuthAPI from 'src/api/authentication';

const DEVICE_ADDRESSES_BASE = '/device-addresses';

export default class DeviceAddressesAPI {
  /**
   * API call that adds device address to database
   * @returns
   * Vlad. 09/08/21
   */
  static addDeviceAddress(address) {
    return api.post(`${DEVICE_ADDRESSES_BASE}`, address)
      .then((resp) => resp)
      .catch((error) => error.response);
  }

  /**
   * API call that fetches all device addresses related to specific user
   * @returns
   * Vlad. 09/08/21
   */
  static getDeviceAddresses() {
    const userID = AuthAPI.getUserId();
    return api.get(`${DEVICE_ADDRESSES_BASE}/${userID}`)
      .then((resp) => resp)
      .catch((error) => error.response);
  }
}
