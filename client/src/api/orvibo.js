import { api } from 'boot/axios';
import { Constants } from 'src/config/constants';

const ORVIBO_API_BASE = '/orvibo';

export default class OrviboAPI {
  /**
   * Function that validates validates Orvibo access_token
   * before sending API call to Orvibo
   * @returns {boolean}
   * Vlad. 28/08/21
   */
  static tokenIsValid() {
    const tokensData = localStorage.getItem(Constants.ORVIBO_TOKEN_KEY);
    const parsedData = tokensData ? JSON.parse(tokensData) : null;
    if (parsedData && parsedData.expires_in) {
      const date = new Date();
      date.setUTCSeconds(parsedData.expires_in);
      return date > new Date();
    }
    return false;
  }

  static expiredToken() {
    return { message: 'TOKEN_EXPIRED' };
  }

  static triggerOrviboAuthentication() {
    const button = document.getElementById('orvibo-auth-btn');
    if (button) {
      localStorage.removeItem(Constants.ORVIBO_TOKEN_KEY);
      button.click();
    }
  }

  /**
   * Function that generates basic query params for Orvibo cloud calls
   * @returns {{access_token: *, user_id}}
   * Vlad. 30/08/21
   */
  static basicPayloadData() {
    const tokensData = localStorage.getItem(Constants.ORVIBO_TOKEN_KEY);
    const parsedData = tokensData ? JSON.parse(tokensData) : null;
    return {
      access_token: parsedData.access_token,
      user_id: parsedData.user_id,
    };
  }

  /**
   * API call that fetches all devices related to logged in user
   * @returns {{message: string}|Promise<AxiosResponse<any>>}
   * Vlad. 03/09/21
   */
  static getUserDeviceList() {
    if (this.tokenIsValid()) {
      const payload = this.basicPayloadData();
      return api.post(`${ORVIBO_API_BASE}/get-devices`, payload);
    }
    this.triggerOrviboAuthentication();
    return this.expiredToken();
  }

  /**
   * API call that sends command to Orvibo device
   * @param action - Object that contains device details and command
   * @returns {Promise<AxiosResponse<any>>}
   * VLad. 06/09/21
   */
  static sendCommandToDevice(action) {
    const payload = Object.assign(this.basicPayloadData(), action);
    return api.post(`${ORVIBO_API_BASE}/operate-device`, payload);
  }
}
