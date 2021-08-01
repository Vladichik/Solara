/**
 *
 * Written by vlad on 01/08/2021
 */

import { api } from 'boot/axios';
import AuthAPI from 'src/api/authentication';

const USER_BASE = '/users';

export default class UserAPI {
  /**
   * API call that fetches logged in user details
   * @return
   * Vlad. 01/08/21
   */
  static getLoggedInUser() {
    const userID = AuthAPI.getUserId();
    return api.get(`${USER_BASE}/user/${userID}`)
      .then((resp) => resp)
      .catch((error) => error.response);
  }
}
