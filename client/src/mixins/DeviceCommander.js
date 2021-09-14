import { computed } from 'vue';
import { useStore } from 'vuex';
import { Constants } from 'src/config/constants';
import OrviboAPI from 'src/api/orvibo';

export default function () {
  const store = useStore();
  // const myOrviboDevice = computed(() => store.state.Devices.myOrviboDevices);
  const sendCommandToDevice = (payload) => {
    // OrviboAPI.sendCommandToDevice(payload);
    if (payload.deviceIds && payload.deviceIds.length) {
      store.commit('General/setMainLoaderState', true);
      const promises = payload.deviceIds.map((id) => new Promise((resolve) => OrviboAPI.sendCommandToDevice({
        deviceId: id,
        action: payload.action,
      }).then((resp) => resolve(resp))));
      Promise.all(promises).then((responses) => {
        store.commit('General/setMainLoaderState', false);
      });
    }
  };

  /**
   * Sending command to open motor/patio
   * @param device - Object
   * @returns {Promise<void>}
   * Vlad. 07/09/21
   */
  const openDevice = async (device) => {
    sendCommandToDevice({
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
    sendCommandToDevice({
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
    sendCommandToDevice({
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
