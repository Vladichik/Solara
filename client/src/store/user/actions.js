import UserAPI from 'src/api/user';

export function getLoggedInUser({ commit }) {
  return UserAPI.getLoggedInUser()
    .then((resp) => {
      if (resp.status === 200 && resp.data.id) {
        commit('setUserData', resp.data);
      }
    })
    .catch((e) => {});
}

export function updateUser({ commit }, user) {
  return UserAPI.updateUser(user)
    .then((resp) => {
      if (resp.status === 200) {
        return true;
      }
      return null;
    })
    .catch((e) => {});
}
