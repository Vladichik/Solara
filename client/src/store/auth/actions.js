import AuthAPI from 'src/api/authentication';

export function signUp({ commit }, user) {
  commit('setAuthProcess', true);
  return AuthAPI.signUp(user)
    .then((resp) => {
      commit('setAuthProcess', false);
      if (resp.status === 200) {
        AuthAPI.setAuthToken(resp.data.access_token);
        return resp;
      }
      if (resp.status === 302) {
        return resp;
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
      if (token.status === 201 && token.data.access_token) {
        AuthAPI.setAuthToken(token.data.access_token);
        return token.data.access_token;
      }
      if (token.status === 401) {
        return 401;
      }
      return !!token;
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
