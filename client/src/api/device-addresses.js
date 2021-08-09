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
   * API call that fetches all manual addresses (Billing/Shipping) from the server
   * @returns
   * Vlad. 09/08/21
   */
  // static getAddresses() {
  //   const userID = AuthAPI.getUserId();
  //   return api.get(`${ADDRESSES_BASE}/manual/${userID}`)
  //     .then((resp) => resp)
  //     .catch((error) => error.response);
  // }
}
