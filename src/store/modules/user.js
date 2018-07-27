import Vue from "vue"
import Vuex from "vuex"
import AuthService from '../../utils/auth';

Vue.use(Vuex)

const state = {
  loginLoading: false,
  searching: "",
  user: null,
  loggedIn: false,
  token: null,
  userInfo: {
    messages: [],
    notifications: [],
    tasks: []
  }
}

const actions = {
  loginAction ({ commit }) {
    commit('loginLoading', true); // set in store the loading action for persistent state to return on the app
    AuthService.login(); // launch directly from store the redirect auth service action
  },
  loginUser ({ commit }, { user, token }) {
    console.log('loginUser actions', token, user);
    commit("setToken", token);
    commit("setUser", user);
    commit("setloggedIn", true);
  },
  updateUser ({ commit }, { user, token }) {
    console.log('updateUser actions', token, user);
    commit("setToken", token);
    commit("setUser", user);
    commit("setloggedIn", true);
  },
  logout ({ commit }) {
    commit("setToken", null);
    commit("setUser", {});
    commit("setloggedIn", false);
    commit("loginLoading", false);
  }
}

const mutations = {
  loginLoading (state, payload) {
    state.loginLoading = payload;
  },
  globalSearching (state) {
    state.searching = state.searching === "" ? "loading" : ""
  },
  setUser (state, user) {
    state.user = user
  },
  setToken (state, token) {
    state.token = token
  },
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo
  },
  setloggedIn (state, payload) {
    state.loggedIn = payload
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
