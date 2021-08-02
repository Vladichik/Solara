import DevicesAPI from 'src/api/device';

export function getMyDevices({ commit }) {
  return DevicesAPI.getMyDevices()
    .then((resp) => {
      if (resp.status === 200 && resp.data) {
        commit('setMyDevices', resp.data);
      }
    })
    .catch((e) => {});
}
