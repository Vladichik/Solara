import DeviceAddressesAPI from 'src/api/device-addresses';

export function getDeviceAddresses({ commit }) {
  return DeviceAddressesAPI.getDeviceAddresses()
    .then((resp) => {
      if (resp.status === 200) {
        commit('setDeviceAddresses', resp.data);
        return resp.data;
      }
      return false;
    })
    .catch((e) => {
      commit('setDeviceAddresses', []);
    });
}
