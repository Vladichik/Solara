/**
 * Written by vlad on 02/08/2021
 */
import { api } from 'boot/axios';
import AuthAPI from 'src/api/authentication';

const ADDRESSES_BASE = '/addresses';

export default class AddressesAPI {
  /**
   * API call that saves address or updates it
   * @returns
   * Vlad. 09/08/21
   */
  static saveAddress(payload) {
    return api.put(`${ADDRESSES_BASE}/manual`, payload)
      .then((resp) => resp)
      .catch((error) => error.response);
  }

  /**
   * API call that fetches all manual addresses (Billing/Shipping) from the server
   * @returns
   * Vlad. 09/08/21
   */
  static getAddresses() {
    const userID = AuthAPI.getUserId();
    return api.get(`${ADDRESSES_BASE}/manual/${userID}`)
      .then((resp) => resp)
      .catch((error) => error.response);
  }
}
