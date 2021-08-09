import { store } from 'quasar/wrappers';
import { createStore } from 'vuex';
import General from './general';
import Addresses from './addresses';
import Auth from './auth';
import User from './user';
import Devices from './devices';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => createStore({
  modules: {
    General,
    Addresses,
    Auth,
    User,
    Devices,
  },

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: process.env.DEBUGGING,
}));
