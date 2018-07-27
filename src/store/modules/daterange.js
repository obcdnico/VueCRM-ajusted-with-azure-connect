/* globals Store */

const state = {
  time: [new Date(), new Date().setDate(new Date().getDate() + 7)], // default is in week
  step: 'day',
  numberSteps: 1,
};

const getters = {};

const actions = {};

const mutations = {
  setTime (state, val) {
    state.time = val;
  },
  setStep (state, val) {
    state.step = val;
  },
  setNumberSteps(state, val) {
    state.numberSteps = val;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
