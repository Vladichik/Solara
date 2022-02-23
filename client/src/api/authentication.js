/**
 *
 * Written by vlad on 15/07/2021
 */

import { api } from 'boot/axios';
import decode from 'jwt-decode';
import { Constants } from '../config/constants';

const AUTH_BASE = '/auth';

export default class AuthAPI {
  /**
   * Function that receives user credentials and creates new user
   * @param credentials - Object with new user details login, password ...
   * @return {Promise}
   * Vlad. 13/1/21
   */
  static signUp(credentials) {
    return api.post(`${AUTH_BASE}/signup`, credentials)
      .then((resp) => resp)
      .catch((error) => error.response);
  }

  /**
   * Function that performs LogIn sequence
   * @param credentials - Object with login credentials
   * @return {Promise}
   * Vlad. 15/1/21
   */
  static signIn(credentials) {
    return api.post(`${AUTH_BASE}/login`, credentials)
      .then((resp) => resp)
      .catch((error) => error.response);
  }

  /**
   * API call that implements authentication in Orvibo Cloud.
   * @param code - String from url parameter after triggering orvibo authentication
   * @returns {Promise}
   * Vlad. 28/08/21
   */
  static orviboLogin(code) {
    return api.post('orvibo/login', { code })
      .then((resp) => resp)
      .catch((error) => error.response);
  }

  /**
   * API call that sends request to refresh token of logged in user
   * @returns
   * Vlad. 11/11/21
   */
  static refreshOrviboToken() {
    const refreshToken = this.getOrviboRefreshToken();
    return api.post('orvibo/refresh-token', { refresh_token: refreshToken })
      .then((resp) => resp)
      .catch((error) => error.response);
  }

  /**
   * Function that sends password recovery request to server
   * @param email - Object containing email for password recovery
   * @return {Promise}
   * Vlad. 15/1/21
   */
  static recoverPassword(email) {
    return api.post(`${AUTH_BASE}/forgot`, email)
      .then((resp) => resp.status)
      .catch((error) => error);
  }

  static signOut() {
    this.clearAuthToken();
    return true;
  }

  /**
   * Setting up token for all http requests and saving it in local storage
   * @param token - String token received after logIn process.
   * Vlad. 15/1/21
   */
  static setAuthToken(token) {
    localStorage.setItem(Constants.AUTH_TOKEN_KEY, token);
    api.defaults.headers.Authorization = token;
  }

  /**
   * Function that sets Orvibo token in local storage for ORVIBO API calls
   * @param token
   * Vlad. 28/08/21
   */
  static setOrviboToken(token) {
    const tokenData = {
      refresh_token: token.refresh_token,
      access_token: token.access_token,
      expires_in: token.expires_in,
      user_id: token.user_id,
    };
    localStorage.setItem(Constants.ORVIBO_TOKEN_KEY, JSON.stringify(tokenData));
  }

  /**
   * Removing token from storage and Axios.
   * To sign out
   * Vlad. 15/1/21
   */
  static clearAuthToken() {
    delete api.defaults.headers.Authorization;
    localStorage.removeItem(Constants.AUTH_TOKEN_KEY);
    localStorage.removeItem(Constants.ORVIBO_TOKEN_KEY);
  }

  /**
   * Function that checks if user is logged in.
   * @return {boolean}
   * Vlad. 15/1/21
   */
  static isLoggedIn() {
    const authToken = this.getAuthToken();
    return !!authToken && !this.isTokenExpired(authToken);
  }

  static getAuthToken() {
    return localStorage.getItem(Constants.AUTH_TOKEN_KEY);
  }

  static getOrviboRefreshToken() {
    const orviboToken = localStorage.getItem(Constants.ORVIBO_TOKEN_KEY);
    if (orviboToken) {
      return JSON.parse(orviboToken).refresh_token;
    }
    return null;
  }

  /**
   * Function that verifies gets token expiration date for
   * further verification
   * @param encodedToken - String token
   * @return {null|Date}
   * Vlad. 15/1/21
   */
  static getTokenExpirationDate(encodedToken) {
    const token = decode(encodedToken);
    if (!token.exp) {
      return null;
    }
    const date = new Date();
    date.setUTCSeconds(token.exp);
    return date;
  }

  /**
   * Function that pulls user id from token
   * @return {*}
   * Vlad. 31/3/21
   */
  static getUserId() {
    const authToken = this.getAuthToken();
    if (authToken) {
      const decoded = decode(authToken);
      return decoded.id;
    }
    return null;
  }

  /**
   * Function that checks if current token is expired
   * @param token - String token
   * @return {boolean}
   * Vlad. 15/1/21
   */
  static isTokenExpired(token) {
    const expirationDate = this.getTokenExpirationDate(token);
    return expirationDate < new Date();
  }

  /**
   * Returns decoded token information
   * @returns {null|unknown}
   * Vlad. 18/4/21
   */
  static getDecodedToken() {
    const authToken = this.getAuthToken();
    if (authToken) {
      return decode(authToken);
    }
    return null;
  }
}
