/**
 *
 * Written by vlad on 29/03/2021
 */

import Vue from 'vue';
import decode from 'jwt-decode';
import { Constants } from '../config/constants';

const self = Vue.prototype;
const AUTH_BASE = '/auth';

export default class AuthAPI {
  /**
   * Function that receives user credentials and creates new user
   * @param credentials - Object with new user details login, password ...
   * @return {Promise}
   * Vlad. 13/1/21
   */
  static signUp(credentials) {
    return self.$api.post(`${AUTH_BASE}/signup`, credentials)
      .then((resp) => resp)
      .catch((error) => error);
  }

  /**
   * Function that performs LogIn sequence
   * @param credentials - Object with login credentials
   * @return {Promise<T | boolean>}
   * Vlad. 15/1/21
   */
  static signIn(credentials) {
    return self.$api.post(`${AUTH_BASE}/login`, credentials)
      .then((resp) => {
        if (resp.status === 201) {
          this.setAuthToken(resp.data.access_token);
          return resp.data.access_token;
        }
        return false;
      })
      .catch(() => false);
  }

  /**
   * Function that sends password recovery request to server
   * @param email - Object containing email for password recovery
   * @return {Promise}
   * Vlad. 15/1/21
   */
  static recoverPassword(email) {
    return self.$api.post(`${AUTH_BASE}/forgot`, email)
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
    self.$api.defaults.headers.Authorization = token;
  }

  /**
   * Removing token from storage and Axios.
   * To sign out
   * Vlad. 15/1/21
   */
  static clearAuthToken() {
    delete self.$api.defaults.headers.Authorization;
    localStorage.removeItem(Constants.AUTH_TOKEN_KEY);
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
