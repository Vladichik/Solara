/**
 *
 * Written by vlad on 27/07/2021
 */

import { api } from 'boot/axios';

const MAPBOX_BASE = '/mapbox';

export default class MapboxAPI {
  /**
   * Function that receives user credentials and creates new user
   * @param text - Object with new user details login, password ...
   * @return {Promise}
   * Vlad. 27/07
   */
  static getSuggestions(text) {
    return api.get(`${MAPBOX_BASE}/address-suggestions`, text)
      .then((resp) => resp)
      .catch((error) => error.response);
  }
}
