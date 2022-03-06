import { useStore } from 'vuex';
import { Constants } from 'src/config/constants';
import OrviboAPI from 'src/api/orvibo';

export default function () {
  const store = useStore();
  let index = 0;
  let partialOpeningIndex = 0;
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
    if (payload.deviceIds && payload.deviceIds.length && payload.deviceIds[index]) {
      // eslint-disable-next-line no-console
      console.log(`Sending command: ${payload.action} - ${payload.deviceIds[index]}`);
      await OrviboAPI.sendCommandToDevice({
        deviceId: payload.deviceIds[index],
        action: payload.action,
      });
      index += 1;
      if (payload.deviceIds[index]) {
        await timeout(Constants.DELAY_BETWEEN_COMMANDS);
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
   * @param groupProcess - is true if motor group is processing
   * @returns {Promise<void>}
   * Vlad. 07/09/21
   */
  const stopProcess = async (device, groupProcess = false) => {
    index = 0;
    await sendCommandToDevice({
      deviceIds: device.selected_ids,
      action: 'Pause',
    });
  };

  const beginFromOpening = async (currentMotor, awaitForFullClosing, awaitForRequiredOpening) => {
    await openDevice({ selected_ids: currentMotor }); // Waiting for motor to fully open
    await timeout(awaitForFullClosing);
    await closeDevice({ selected_ids: currentMotor }); // beginning opening closed motor
    await timeout(awaitForRequiredOpening); // Waiting for motor to reach specific point.
    await stopProcess({ selected_ids: currentMotor }, true);
  };

  const beginFromClosing = async (currentMotor, awaitForFullClosing, awaitForRequiredOpening) => {
    await closeDevice({ selected_ids: currentMotor });
    await timeout(awaitForFullClosing); // Waiting for motor to fully close
    await openDevice({ selected_ids: currentMotor }); // beginning opening closed motor
    await timeout(awaitForRequiredOpening); // Waiting for motor to reach specific point.
    await stopProcess({ selected_ids: currentMotor }, true);
  };

  /**
   * THis idiotic function is made to preset all angines according to favorites
   * state saved by user. This sick flow is forced to be done because our motors
   * do not have telemetry and can not be controlled wisely.
   * @param device - Object (Device with Motors)
   * @returns {Promise<T>}
   * Vlad. 02/10/21
   */
  const triggerFavoritesMotorOpening = async (device) => {
    const awaitForFullClosing = Constants[`${device.motor_type}_SPEED`] + Constants.DELAY_BETWEEN_COMMANDS;
    const awaitForRequiredOpening = Constants[`${device.motor_type}_${device.favorites_set[partialOpeningIndex].state}`];
    const currentMotor = [device.favorites_set[partialOpeningIndex].orvibo_id];
    const requiredState = device.favorites_set[partialOpeningIndex].state;
    if (requiredState === Constants.MOTOR_QT_OPEN) {
      await beginFromOpening(currentMotor, awaitForFullClosing, awaitForRequiredOpening);
    } else {
      await beginFromClosing(currentMotor, awaitForFullClosing, awaitForRequiredOpening);
    }
    partialOpeningIndex += 1;
    if (device.favorites_set[partialOpeningIndex]) {
      // Triggering next motor if exists
      await timeout(Constants.DELAY_BETWEEN_COMMANDS);
      triggerFavoritesMotorOpening(device).then();
    } else {
      store.commit('General/setMainLoaderState', false);
    }
  };

  /**
   * Function implements single motor operation to specific state.
   * Triggered from device control panel
   * @param device
   * @param position
   * Vlad. 19/02/22
   */
  const openMotorPartially = async (device, position) => {
    store.commit('General/setProcessingSemi', true);
    if (device && device.selected_ids.length) {
      const awaitForFullClosing = Constants[`${device.motor_type}_SPEED`] + Constants.DELAY_BETWEEN_COMMANDS;
      const awaitForRequiredOpening = Constants[`${device.motor_type}_${position}`];
      const currentMotor = [device.selected_ids[partialOpeningIndex]];
      if (position === Constants.MOTOR_QT_OPEN) {
        await beginFromOpening(currentMotor, awaitForFullClosing, awaitForRequiredOpening);
      } else {
        await beginFromClosing(currentMotor, awaitForFullClosing, awaitForRequiredOpening);
      }
      partialOpeningIndex += 1;
      if (device.selected_ids[partialOpeningIndex]) {
        // Triggering next motor if exists
        await timeout(Constants.DELAY_BETWEEN_COMMANDS);
        openMotorPartially(device, position).then();
      } else {
        store.commit('General/setMainLoaderState', false);
        store.commit('General/setProcessingSemi', false);
      }
    }
    return false;
  };

  const initiateMotorsPartialOpeningProcess = async (device, position) => {
    partialOpeningIndex = 0;
    await openMotorPartially(device, position);
  };

  const initiateFavoritesProcess = async (device) => {
    partialOpeningIndex = 0;
    await triggerFavoritesMotorOpening(device);
  };

  return {
    openDevice,
    closeDevice,
    stopProcess,
    initiateMotorsPartialOpeningProcess,
    initiateFavoritesProcess,
  };
}
