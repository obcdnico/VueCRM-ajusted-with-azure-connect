/* eslint-disable */
import Vue from "vue"
import Vuex from "vuex"
import api from "@/utils/backend-api";

Vue.use(Vuex)
var copyObjectOrArray = function(o) {
    return JSON.parse(JSON.stringify(o));
}
function generateHumanReadableDate(unixtimestamp) {
  var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  // Convert timestamp to milliseconds
  var date = new Date(unixtimestamp*1000);
  // console.log('date', date);
  // Year
  var year = date.getFullYear();
  // Month
  var month = months_arr[date.getMonth()];
  // Day
  var day = date.getDate();
  // Hours
  var hours = date.getHours();
  // Minutes
  var minutes = "0" + date.getMinutes();
  // Seconds
  var seconds = "0" + date.getSeconds();
  // Display date time in MM-dd-yyyy h:m:s format
  var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  // console.log ('convdataTime', convdataTime);
  return convdataTime;
}

const state = {
  sampleGraph1Datas: [],
}

const actions = {
  getSampleGraph1 ({ commit }) {
    api.getData("sampleGraph1").then(res => {
      commit("setDatas", res.data);
    });
  },
  getGraphDataFromApi ({ state, commit, rootState }) {
    console.log('getGraphDataFromApi', state, commit, rootState);
  }
}

const mutations = {
  setDatas (state, payload) {
    state.sampleGraph1Datas = payload
  }
}

const getters = {
  getSampleGraph1DataCurrent (state) {
    return state.sampleGraph1Datas.map(a => [a.timestamp*1000, a.current]);
  },
  getSampleGraph1DataSoc (state) {
    return state.sampleGraph1Datas.map(a => [a.timestamp*1000, a.soc]);
  },
  getSampledatasSocForspline (state) {
    return state.sampleGraph1Datas.map(a => [a.timestamp*1000, a.soc]);
  },
  getSampleGraph1DataTemperature (state) {
    return state.sampleGraph1Datas.map(a => [a.timestamp*1000, a.temperature]);
  },
  getSampleGraph1DataVoltage (state) {
    return state.sampleGraph1Datas.map(a =>  [a.timestamp*1000, a.voltage]);
  },
  getSampleGraph1DataTimestamp (state) {
    return state.sampleGraph1Datas.map(a => generateHumanReadableDate(a.timestamp));
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
