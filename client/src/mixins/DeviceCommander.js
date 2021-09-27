import { useStore } from 'vuex';
import OrviboAPI from 'src/api/orvibo';

export default function () {
  const store = useStore();
  let index = 0;

  const timeout = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * This function handles semi open process.
   * It waits 11 seconds for each available moto to close then
   * it begins to reopen each motor and after 5 seconds pauses the process.
   * All times were calculated manually and real operation might be a bit
   * uncalibrated
   * @param deviceId - string ID of the motor that should be operated
   * @returns {Promise<void>}
   * Vlad. 17/09/21
   */
  const handleSemiOpenProcess = async (deviceId) => {
    await timeout(11000);
    openDevice({
      selected_ids: [deviceId],
    }).then();
    await timeout(5000);
    stopProcess({
      selected_ids: [deviceId],
    }).then();
  };

  /**
   * Since Orvibo api does not support multiple device operation at the same time
   * and it also does not support query burst, we send multiple device operation as synchronised
   * queries - each next query fires after previous query finishes.
   * @param payload - Object
   * @param cameFromSemiOpen - Boolean value that is TRUE if function is called by semiOpenDevice
   * @returns {Promise<boolean>}
   * Vlad. 16/09/21
   */
  const sendCommandToDevice = async (payload, cameFromSemiOpen) => {
    if (payload.deviceIds && payload.deviceIds.length) {
      store.commit('General/setMainLoaderState', true);
      await OrviboAPI.sendCommandToDevice({
        deviceId: payload.deviceIds[index],
        action: payload.action,
      });
      // If semi open called this function we call the STOP method
      if (cameFromSemiOpen) {
        handleSemiOpenProcess(payload.deviceIds[index]).then();
      }
      index += 1;
      if (payload.deviceIds[index]) {
        await timeout(1000);
        await sendCommandToDevice(payload, cameFromSemiOpen);
      } else {
        store.commit('General/setMainLoaderState', false);
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
   * Function that half opens patio.
   * Basically what we do is closing thee patio (waiting 10 seconds until it closes)
   * Than we fire
   * @param device
   * @returns {Promise<void>}
   */
  const beginSemiOpenProcess = async (device) => {
    index = 0;
    await sendCommandToDevice({
      deviceIds: device.selected_ids,
      action: 'TurnOff',
    }, true);
  };

  return {
    openDevice,
    closeDevice,
    stopProcess,
    beginSemiOpenProcess,
  };
}
