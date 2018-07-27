/* globals Store */
import * as axios from 'axios';
import deepCopy from '../../helpers/deepCopy';

function getUnixTimestamp(stringDate) {
  return Date.parse(stringDate);
}
function gmtToUtcDate(string) {
  return new Date(string).toISOString()
}

const baseUrl = process.env.API_URL;

const state = {
  listContainers: [],
  error: null,
  container: {}, // equi to Map() in a hash map Object of container downloaded from the api
  containerAlarmsEvents: {}, // equi to Map() with Object in a hash map Objects of container downloaded from the api
  currentId: null,
  alarmsEvents: [],
};

const actions = {
  getSources ({ commit }) {
    axios.get(baseUrl + '/source')
    .then(function (response) {
      console.log('getSources res', response);
      commit('setListContainers', response.data);
    })
    .catch(function (error) {
      console.log('http error: ', error);
      commit('setError', error);
    });

  },
  getContainerInfos ({ commit, rootState, state }, id) {
    if (!id) { id = state.currentId}
    axios.get(baseUrl + '/source/' + id + '/measure?startDate=' + gmtToUtcDate(rootState.daterange.time[0]) + '&endDate=' + gmtToUtcDate(rootState.daterange.time[1]))
    .then(function (response) {
      console.log('getContainerInfos res', response);
      // set full data response in the container object by id (like a map)
      commit('setContainer', {payload: response.data, id});
    })
    .catch(function (error) {
      console.log('http error: ', error);
      commit('setError', error);
    });
  },
  getSourceAlarmsEvents ({ commit, rootState, state }, id) {
    if (!id) { id = state.currentId}
    axios.get(baseUrl + '/source/' + id + '/event?startDate=' + gmtToUtcDate(rootState.daterange.time[0]) + '&endDate=' + gmtToUtcDate(rootState.daterange.time[1]))
    .then(function (response) {
      console.log('getSourceAlarmsEvents res', response);
      commit('setContainerAlarmsEvents', {payload: response.data, id});
    })
    .catch(function (error) {
      console.log('http error: ', error);
      commit('setError', error);
    });
  }
};

const mutations = {
  setMutations(state, payload = {}) { // payload is a key from store && any value to update
    // for all base var in object i deep copy the array or the object in the store for sure updates
    for (var i in payload) {
      state[i] = deepCopy(payload[i]); // deepCopy to erase array or object references
    }
  },
  setListContainers (state, payload) {
    /* MOCK FOR SOH value */
    payload.map(el => {
      el.measurePoints.push({
        code: "soh",
        name: "State Of Health",
        unit: "%"
      });
      return el;
    });
    state.listContainers = payload
  },
  setContainer (state, {payload, id}) {
    // first api call for container set the context id to see
    state.currentId = id; // always set current id for donctainer (alarm and container)
    state.container[id] = payload;
    // deep copy for object or array for return api
    state.container = deepCopy(state.container);
  },
  setContainerAlarmsEvents (state, {payload, id}) {
    state.currentId = id // always set current id for donctainer (alarm and container)
    state.containerAlarmsEvents[id] = payload;
    // deep copy for object or array for return api
    state.containerAlarmsEvents = deepCopy(state.containerAlarmsEvents);
  },
  setError (state, payload) {
    state.error = payload
  }
};

const getters = {
  getNumberOfSources(state) {
    return state.listContainers.length
  },
  getListOfContainers (state) {
    return state.listContainers
  },
  getContainerById (state, id) {
    return state.container[id]
  },
  // get and filter data united && set the timestamp for hightchart datas
  getGraphDataIntensity (state) {
    const filtered = state.container[state.currentId] ? state.container[state.currentId].filter(el => el.code === 'I') : [];
    return filtered.map(a => [getUnixTimestamp(a.timeStamp), a.value]);
  },
  getGraphDataSoc (state) {
    const filtered = state.container[state.currentId] ? state.container[state.currentId].filter(el => el.code === 'soc') : [];
    return filtered.map(a => [getUnixTimestamp(a.timeStamp), a.value]);
  },
  getGraphDataTemperature (state) {
    const filtered = state.container[state.currentId] ? state.container[state.currentId].filter(el => el.code === 'temp') : [];
    return filtered.map(a => [getUnixTimestamp(a.timeStamp), a.value]);
  },
  getGraphDataVoltage (state) {
    const filtered = state.container[state.currentId] ? state.container[state.currentId].filter(el => el.code === 'U') : [];
    return filtered.map(a =>  [getUnixTimestamp(a.timeStamp), a.value]);
  },
  // master function to generate graph data for dashboard page from previous functions
  getMultipleGraphDatas(state, getters) {
    const res = [
    {
      yAxisText: 'SOC',
      xAxisEnabled: false,
      labelsFormatterText: null,
      data: getters.getGraphDataSoc
    },
    {
      yAxisText: 'Intensity',
      xAxisEnabled: false,
      labelsFormatterText: 'I',
      data: getters.getGraphDataIntensity
    },
    {
      yAxisText: 'Temperature',
      xAxisEnabled: false,
      labelsFormatterText: '°',
      data: getters.getGraphDataTemperature
    },
    {
      yAxisText: 'Voltage',
      xAxisEnabled: true,
      labelsFormatterText: 'V',
      data: getters.getGraphDataVoltage
    },
    ];
    return res;
  },
  getAlarmsEvents(state, getters) {
    console.log('getAlarmsEvents currentId', state.currentId);
    console.log('getAlarmsEvents containerAlarmsEvents', state.containerAlarmsEvents);
    console.log('gggggg', state.containerAlarmsEvents[state.currentId]);
    // need to be var to be process as var return from webpack
    const returnVal = state.containerAlarmsEvents[state.currentId].map(el => {
      // modify value of object
      el.start = getUnixTimestamp(el.start);
      el.end = getUnixTimestamp(el.end);
      return el;
    });
    return returnVal;
  },
  getAllAlarmsEvents(state, getters) {
    return state.containerAlarmsEvents;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
