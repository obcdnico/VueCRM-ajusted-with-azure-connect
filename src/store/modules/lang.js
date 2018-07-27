import {app} from '../../main'

const state = {};

const getters = {
  getLanguage: state => {
    console.log('getLanguage', state.language)
    return state.language;
  }
};

const actions = {
  setLang({commit}, payload) {
    commit('setLang', payload)
  }
};

const mutations = {
  setLang (state, payload) {
    app.$i18n.locale = payload
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
