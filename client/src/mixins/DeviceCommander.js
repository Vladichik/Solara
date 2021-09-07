import { computed } from 'vue';
import { useStore } from 'vuex';
import { Constants } from 'src/config/constants';
import OrviboAPI from 'src/api/orvibo';

export default function () {
  // const store = useStore();
  // const myOrviboDevice = computed(() => store.state.Devices.myOrviboDevices);
  const sendCommandToDevice = (payload) => OrviboAPI.sendCommandToDevice(payload);

  /**
   * Sending command to open motor/patio
   * @param deviceId - String
   * @returns {Promise<void>}
   * Vlad. 07/09/21
   */
  const openDevice = async (deviceId) => {
    const sent = await sendCommandToDevice({
      deviceId,
      action: 'TurnOn',
    });
  };

  /**
   * Sending command to close motor/patio
   * @param deviceId - String
   * @returns {Promise<void>}
   * Vlad. 07/09/21
   */
  const closeDevice = async (deviceId) => {
    const sent = await sendCommandToDevice({
      deviceId,
      action: 'TurnOff',
    });
  };

  /**
   * Sending command to pause/stop the process
   * @param deviceId - String
   * @returns {Promise<void>}
   * Vlad. 07/09/21
   */
  const stopProcess = async (deviceId) => {
    const sent = await sendCommandToDevice({
      deviceId,
      action: 'Pause',
    });
  };

  return {
    openDevice,
    closeDevice,
    stopProcess,
  };
}
