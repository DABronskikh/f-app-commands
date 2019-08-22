export default {
  state: {
    loginDialog: false,
    registerDialog: false,
    resetPasswordDialog: false,
  },
  mutations: {
    setLoginDialog (state, payload) {
      state.loginDialog = !state.loginDialog
    },
    setRegisterDialog (state, payload) {
      state.registerDialog = !state.registerDialog
    },
    setResetPasswordDialog (state, payload) {
      state.resetPasswordDialog = !state.resetPasswordDialog
    },
  },
  actions: {
    togleLoginDialog ({commit}, payload) {
      commit('setLoginDialog')
    },
    togleRegisterDialog ({commit}, payload) {
      commit('setRegisterDialog')
    },
    togleResetPasswordDialog ({commit}, payload) {
      commit('setResetPasswordDialog')
    },
  },
  getters: {
    loginDialog (state) {
      return state.loginDialog
    },
    registerDialog (state) {
      return state.registerDialog
    },
    resetPasswordDialog (state) {
      return state.resetPasswordDialog
    },
  },
}
