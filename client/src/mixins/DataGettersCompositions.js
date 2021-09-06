import { computed } from 'vue';
import { useStore } from 'vuex';
import { Constants } from 'src/config/constants';

export default function () {
  const store = useStore();
  const myOrviboDevice = computed(() => store.state.Devices.myOrviboDevices);
  /**
   * Function that generates url for authentication in Orvibo Cloud
   * @returns {`https://oauthcn.orvibo.com/oauth/auth?redirect_uri=${string}&client_id=solara&response type=code&state=user`}
   * Vlad. 29/08/21
   */
  const getOrviboAuthUrl = () => {
    const redirectTo = `${window.location.origin}/orvibo-oauth`;
    return `${Constants.ORVIBO_BASE_URL}auth?redirect_uri=${redirectTo}&client_id=${Constants.ORVIBO_CLIENT_ID}&response type=code&state=user`;
  };

  /**
   * Function that gets the name of the device by deviceId
   * @param deviceId - String
   * @returns {string|*|string}
   * Vlad. 06/09/21
   */
  const getDeviceName = (deviceId) => {
    if (myOrviboDevice.value && myOrviboDevice.value.length) {
      const name = myOrviboDevice.value.find((d) => d.deviceId === deviceId);
      return name ? name.deviceName : '';
    }
    return '';
  };

  return {
    getOrviboAuthUrl,
    getDeviceName,
  };
}
