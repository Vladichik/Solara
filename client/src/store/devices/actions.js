import DevicesAPI from 'src/api/device';

export function getLoggedInUser({ commit }) {
  commit('General.setMainLoaderState', true);
  return DevicesAPI.getMyDevices()
    .then((resp) => {
      debugger;
      if (resp.status === 200 && resp.data.id) {
        // commit('setUserData', resp.data);
      }
    })
    .catch((e) => {});
}
