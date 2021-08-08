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
  static saveAddress() {
    return api.put(`${ADDRESSES_BASE}`)
      .then((resp) => resp)
      .catch((error) => error.response);
  }
}
