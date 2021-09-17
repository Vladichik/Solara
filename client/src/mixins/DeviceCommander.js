import { useStore } from 'vuex';
import OrviboAPI from 'src/api/orvibo';

export default function () {
  const store = useStore();
  let index = 0;
  // const myOrviboDevice = computed(() => store.state.Devices.myOrviboDevices);
  /**
   * Since Orvibo api does not support multiple device operation at the same time
   * and it also does not support query burst, we send multiple device operation as synchronised
   * queries - each next query fires after previous query finishes.
   * @param payload - Object
   * @returns {Promise<void>}
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
        await sendCommandToDevice(payload);
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

  return {
    openDevice,
    closeDevice,
    stopProcess,
  };
}
