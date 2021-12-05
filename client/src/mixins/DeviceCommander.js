import { useStore } from 'vuex';
import { Constants } from 'src/config/constants';
import OrviboAPI from 'src/api/orvibo';

export default function () {
  const store = useStore();
  let index = 0;

  const timeout = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Since Orvibo api does not support multiple device operation at the same time
   * and it also does not support query burst, we send multiple device operation as synchronised
   * queries - each next query fires after previous query finishes.
   * @param payload - Object
   * @returns {Promise<boolean>}
   * Vlad. 16/09/21
   */
  const sendCommandToDevice = async (payload) => {
    if (payload.deviceIds && payload.deviceIds.length) {
      store.commit('General/setMainLoaderState', true);
      await OrviboAPI.sendCommandToDevice({
        deviceId: payload.deviceIds[index],
        action: payload.action,
      });
      index += 1;
      if (payload.deviceIds[index]) {
        await timeout(1000);
        await sendCommandToDevice(payload);
      }
    }
  };

  /**
   * Sending command to open motor/patio
   * @param device - Object
   * @returns {Promise<void>}
   * Vlad. 07/09/21
   */
  const openDevice = async (device) => {
    index = 0;
    await sendCommandToDevice({
      deviceIds: device.selected_ids,
      action: 'TurnOn',
    });
  };

  /**
   * Sending command to close motor/patio
   * @param device - Object
   * @returns {Promise<void>}
   * Vlad. 07/09/21
   */
  const closeDevice = async (device) => {
    index = 0;
    await sendCommandToDevice({
      deviceIds: device.selected_ids,
      action: 'TurnOff',
    });
  };

  /**
   * Sending command to pause/stop the process
   * @param device - Object
   * @returns {Promise<void>}
   * Vlad. 07/09/21
   */
  const stopProcess = async (device) => {
    index = 0;
    await sendCommandToDevice({
      deviceIds: device.selected_ids,
      action: 'Pause',
    });
  };

  /**
   * THis idiotic function is made to preset all angines according to favorites
   * state saved by user. This sick flow is forced to be done because our motors
   * do not have telemetry and can not be controlled wisely.
   * @param device - Object (Device with Motors)
   * @returns {Promise<T>}
   * Vlad. 02/10/21
   */
  const triggerFavoritesPreset = async (device) => {
    debugger;
    const favoritesMotors = device.favorites_set.map((m) => m.orvibo_id);
    await closeDevice({ selected_ids: favoritesMotors });
    const awaitForFullClosing = Constants[`${device.motor_type}_SPEED`] + favoritesMotors.length * 1000;
    await timeout(awaitForFullClosing);
    await openDevice({ selected_ids: favoritesMotors });
    const processes = device.favorites_set.map((motor, i) => new Promise((resolve) => {
      const stopAfterSeconds = Constants[`${device.motor_type}_${motor.state}`] + 1000 * i;
      setTimeout(() => {
        stopProcess({ selected_ids: [motor.orvibo_id] });
        resolve(motor.orvibo_id);
      }, stopAfterSeconds);
    }));
    return Promise.all(processes).then((data) => {
      store.commit('General/setMainLoaderState', false);
    });
  };

  /**
   * Function triggers group operation of the motors when user presses the button
   * on the device control panel
   * @param device
   * @param position
   * Vlad. 27/11/21
   */
  const triggerMotorsPartialOpening = async (device, position) => {
    if (device && device.selected_ids.length) {
      const awaitForFullClosing = Constants[`${device.motor_type}_SPEED`] + device.selected_ids.length * 1000;
      await closeDevice({ selected_ids: device.selected_ids });
      await timeout(awaitForFullClosing);
      await openDevice({ selected_ids: device.selected_ids });
      const processes = device.selected_ids.map((motor, i) => new Promise((resolve) => {
        const stopAfterSeconds = Constants[`${device.motor_type}_${position}`] + 1000 * i;
        setTimeout(() => {
          stopProcess({ selected_ids: [motor] });
          resolve(motor);
        }, stopAfterSeconds);
      }));
      return Promise.all(processes).then((data) => {
        store.commit('General/setMainLoaderState', false);
      });
    }
    return false;
  };

  return {
    openDevice,
    closeDevice,
    stopProcess,
    triggerMotorsPartialOpening,
    triggerFavoritesPreset,
  };
}
