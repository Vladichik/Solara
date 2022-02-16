import DevicesAPI from 'src/api/device';
import OrviboAPI from 'src/api/orvibo';

export function getMyDevicesFromOrvibo({ commit }) {
  return OrviboAPI.getUserDeviceList()
    .then((resp) => {
      if (resp.status === 200 && resp.data) {
        commit('setMyOrviboDevices', resp.data.devices);
      }
    })
    .catch((e) => {
    });
}

export function getMyDevices({ commit }) {
  return DevicesAPI.getMyDevices()
    .then((resp) => {
      if (resp.status === 200 && resp.data) {
        if (resp.data.length) {
          commit('setMyDevices', resp.data);
        } else {
          commit('setNoDevicesYet', true);
        }
      }
    })
    .catch((e) => {
    });
}
