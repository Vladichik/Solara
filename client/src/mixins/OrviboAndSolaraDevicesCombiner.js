import { computed } from 'vue';
import { useStore } from 'vuex';
import { Constants } from 'src/config/constants';

export default function () {
  const store = useStore();
  const myDevicesOrvibo = computed(() => store.state.Devices.myOrviboDevices);
  const myDevices = computed(() => store.state.Devices.myDevices);

  /**
   * This function generates devices environments list data
   * Vlad. 28/09/21
   */
  const generateEnvironments = () => {
    if (myDevicesOrvibo.value && myDevicesOrvibo.value.length && myDevices.value && myDevices.value.length) {
      const cloned = JSON.parse(JSON.stringify(myDevicesOrvibo.value));
      const clonedMyDevices = JSON.parse(JSON.stringify(myDevices.value));

      const environments = cloned.filter((device) => device.deviceTypeName.includes(Constants.HUB_MARK));
      const orviboRegisteredDevices = cloned.map((d) => d.deviceId);
      myDevicesOrvibo.value.forEach((device) => {
        if (device.subDeviceType.includes(Constants.HUB_MARK)) {
          const foundGroup = environments.find((g) => g.uid === device.uid);
          if (foundGroup) {
            foundGroup.devices = clonedMyDevices.filter((md) => md.hub_id === foundGroup.deviceId
              && md.orvibo_ids.some((oid) => orviboRegisteredDevices.includes(oid)));
          }
        }
      });
      return environments;
    }
    return [];
  };
  return {
    generateEnvironments,
  };
}
