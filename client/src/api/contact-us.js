/**
 * Written by vlad on 19/09/2021
 */
import { api } from 'boot/axios';

const CONTACT_US_BASE = '/contact-us';

export default class ContactUsAPI {
  /**
   * API call for fetching contact us information
   * @returns
   * Vlad. 21/09/21
   */
  static getContactInfo() {
    return api.get(`${CONTACT_US_BASE}`)
      .then((resp) => resp)
      .catch((error) => error.response);
  }
}
