import AuthAPI from 'src/api/authentication';

export function signUp({ commit }, user) {
  commit('setAuthProcess', true);
  return AuthAPI.signUp(user)
    .then((resp) => {
      commit('setAuthProcess', false);
      if (resp.status === 200) {
        return resp.data;
      }
      if (resp.message.includes('302')) {
        return 302;
      }
      return false;
    })
    .catch((e) => {
      commit('setAuthProcess', false);
    });
}

export function signIn({ commit }, user) {
  commit('setAuthProcess', true);
  return AuthAPI.signIn(user)
    .then((token) => {
      commit('setAuthProcess', false);
      return !!token;
    })
    .catch((e) => {
      commit('setAuthProcess', false);
    });
}

export async function signOut({ commit }) {
  return AuthAPI.signOut();
}

export async function forgotPassword({ commit }, email) {
  commit('setAuthProcess', true);
  return AuthAPI.recoverPassword(email).then((resp) => {
    commit('setAuthProcess', false);
    return resp;
  }).catch(() => {
    commit('setAuthProcess', false);
  });
}
