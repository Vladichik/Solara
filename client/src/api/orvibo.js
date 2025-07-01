import { api } from 'boot/axios';
import { Constants } from 'src/config/constants';
import AuthAPI from 'src/api/authentication';
import UserAPI from 'src/api/user';

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
      access_token: parsedData?.access_token || '',
      user_id: parsedData?.user_id || '',
    };
  }

  /**
   * API call that fetches all devices related to logged in user
   * @returns {{message: string}|Promise<AxiosResponse<any>>}
   * Vlad. 03/09/21
   */
  static async getUserDeviceList() {
    if (this.tokenIsValid()) {
      const payload = this.basicPayloadData();
      const devices = await api.post(`${ORVIBO_API_BASE}/get-devices`, payload);
      // Case when token is valid, but token itself is wrong because of server side update
      if (devices.data && devices.data.errorMsg && devices.data.errorMsg.includes('token')) {
        this.triggerOrviboAuthentication();
        return false;
      }
      return devices;
    }
    if (!localStorage.getItem(Constants.ORVIBO_TOKEN_KEY)) {
      this.triggerOrviboAuthentication();
    } else {
      this.refreshTokenAndUpdateSolara().then();
    }
    return '';
  }

  /**
   * Function that refreshes Orvibo token and saves it in Solara DB
   * @returns {Promise<void>}
   * Vlad. 11/11/21
   */
  static async refreshTokenAndUpdateSolara() {
    const { data } = await AuthAPI.refreshOrviboToken();
    if (data && data.refresh_token) {
      AuthAPI.setOrviboToken(data);
      const tokenData = {
        orvibo_id: data.user_id,
        orvibo_token: `Bearer ${data.access_token}`,
        orvibo_token_exp: data.expires_in,
        orvibo_refresh_token: data.refresh_token,
      };
      await UserAPI.updateUser(tokenData);
    }
    if (data && data.error === 'invalid_grant') {
      localStorage.removeItem(Constants.ORVIBO_TOKEN_KEY);
      this.triggerOrviboAuthentication();
    }
  }

  /**
   * API call that sends command to Orvibo device
   * @param action - Object that contains device details and command
   * @returns {Promise<AxiosResponse<any>>}
   * VLad. 06/09/21
   */
  static sendCommandToDevice(action) {
    const payload = Object.assign(this.basicPayloadData(), action);
    console.log(payload);
    return api.post(`${ORVIBO_API_BASE}/operate-device`, payload);
  }
}
