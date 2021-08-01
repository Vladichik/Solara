import UserAPI from 'src/api/user';

export function getLoggedInUser({ commit }) {
  return UserAPI.getLoggedInUser()
    .then((resp) => {
      debugger;
      commit('setUserData', resp.data);
    })
    .catch((e) => {
    });
}
