<template>
  <div>

    <div id="mySidenav" class="sidenav" style="z-index:99;">
      <v-layout justify-space-around class="rightPanel-layout-head">
        <a href="javascript:void(0)" class="closebtn_" v-on:click="closeNav()">&times;</a>
        <v-flex class="rightPanel-title">{{numberContainer}} Containers</v-flex>
        <v-flex class="rightPanel-title-alarms"><v-icon class="rightPanel-notif-icon">notification_important</v-icon> {{getNumberAlarmsForContainersItems()}} alerts</v-flex>
      </v-layout>
      <v-layout class="rightPanel-layout-table">
        <v-flex>
          <v-data-table
            :headers="headers"
            :items="markerContainers"
            hide-actions
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <tr :key="props.index" v-bind:class="getTableTrClass(props.item)" v-on:click="clickOnListElement(props.item)">
                <td><span v-if="getTableTrClass(props.item) !== severityHashTable['-Infinity']">&middot;&nbsp;</span>{{ props.item.name }}</td>
                <td class="text-xs-right">{{ props.item.calories }} SOH </td>
                <td class="text-xs-right">{{ props.item.fat }} SOC </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </div>

    <l-map ref="map" style="position:fixed; height: 50rem"
      :zoom="zoom"
      :center="center"
      :worldCopyJump="false"
      :minZoom="minZoom"
      :maxBounds="maxBounds"
      :maxBoundsViscosity="1.0"
      :options="{noWrap: true}">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <v-marker-cluster ref="clusterRef" :options="{polygonOptions: { stroke: false, color: 'transparent' }, zoomToBoundsOnClick: false, spiderfyOnMaxZoom: false, removeOutsideVisibleBounds: true}">
        <l-marker
          v-for="container in getListOfContainers" :key="container.id"
          v-if="container.latitude !== null && container.longitude !== null"
          :icon="icon"
          :lat-lng="latLng(container.latitude, container.longitude)"
          v-on:click="clickOnMarker($event, container)"
          :options="{customObjectContainer: container}">
          <!-- <l-tooltip :content="generateHtmlTootip(container)"></l-tooltip> -->
        </l-marker>
      </v-marker-cluster>
    </l-map>
  </div>
</template>

<script>
/* globals Store */
import Vue from 'vue'
import throttle from '../helpers/throttle';
import { LMap, LTileLayer, LMarker, LTooltip, LPopup } from 'vue2-leaflet';
import { latLngBounds, latLng, icon } from 'leaflet';
import { mapGetters } from 'vuex'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
// import googleGeocode from '../helpers/googleGeocode'
// https://leafletjs.com/examples/custom-icons/
var customIcon = icon({
    iconUrl: '/assets/img/marker-icon.png',
    shadowUrl: '/assets/img/marker-shadow.png',
});

export default {
  name: 'example',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LPopup,
    'v-marker-cluster': Vue2LeafletMarkerCluster
  },
  data () {
    return {
      maxBounds: latLngBounds(latLng(90, -180), latLng(-90, 180)), // bound for one world limit
      zoom: 3,
      minZoom: 2,
      icon: customIcon,
      center: latLng(47.413220, -1.219482),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: latLng(47.413220, -1.219482),
      rightPanel: true,
      headers: [
        {
          text: 'Name',
          align: 'center',
          sortable: true,
          value: 'name',
        },
        { text: 'SOH', value: 'soh', align: 'center' },
        { text: 'SOC', value: 'soc', align: 'center' }
      ],
      numberContainer: '',
      numberAlarms: '',
      markerContainers: [],
      rightPanelIncludedMarkers: [],
      severityHashTable: {
        '-Infinity': 'table-tr-normal',
        0: 'table-tr-unknow',
        1: 'table-tr-low',
        2: 'table-tr-medium',
        3: 'table-tr-hight'
      },
    }
  },
  computed: {
    ...mapGetters("sources", {
      getListOfContainers: 'getListOfContainers',
      getAllAlarmsEvents: 'getAllAlarmsEvents',
    })
  },
  methods: {
    clickOnListElement(container) {
      // go to container detail page
      this.removeNavListener();
      this.$router.push({
        name: 'Containers',
        params: {id: container.id}
      });
    },
    getNumberAlarmsForContainersItems() {
      var vm = this;
      var counter = 0;
      vm.rightPanelIncludedMarkers.map(el => {
        // el = el.options.customObjectContainer;
        for (let identifier in vm.getAllAlarmsEvents) {
          var alarm = vm.getAllAlarmsEvents[identifier];
          // only for good alarm id
          if (identifier === el.id) {
            // get the max severuty for alarms
            alarm.map(function(o) {
              counter++;
            });
          }
        }
      });
      return counter;
    },
    getTableTrClass(item) {
      var vm = this;
      // search if alarm exist for this item
      for (let identifier in vm.getAllAlarmsEvents) {
        var alarm = vm.getAllAlarmsEvents[identifier];
        // only for good alarm id
        if (identifier === item.id) {
          // get the max severuty for alarms
          const maxSeverity = Math.max.apply(Math, alarm.map(function(o) { return o.data.severity; }))
          const myClass = vm.severityHashTable[maxSeverity];
          return myClass;
        }
      }
      return 'table-tr-normal'
    },
    latLng(lat, long) {
      return latLng(lat, long);
    },
    generateHtmlTootip(container) {
      const els = container.measurePoints.map(el => {
        return el.name;
      })
      return `${container.name} <br> ${els.join(', ')}`;
    },
    closeNavClickHandler(e) {
      var vm = this;
      if (!document.getElementById('mySidenav').contains(e.target)){
        vm.closeNav();
      }
    },
    addNavListener() {
      window.addEventListener('click', this.closeNavClickHandler, true);
    },
    removeNavListener() {
      window.removeEventListener('click', this.closeNavClickHandler, true);
    },
    openNav() {
      var vm = this;
      document.getElementById("mySidenav").style.width = "50rem";
      // listen to close nav
      vm.addNavListener();
    },
    closeNav() {
      var vm = this;
      document.getElementById("mySidenav").style.width = "0";
      vm.rightPanelIncludedMarkers = [];
      vm.removeNavListener();
    },
    clickOnMarker(evt, container) {
      var vm = this;
      // show panel with some datas in it
      Store.dispatch("sources/getSourceAlarmsEvents", container.id);
      vm.numberContainer = 1;
      vm.markerContainers = [{
        id: container.id,
        name: container.name,
        soc: container.measurePoints.find(point => point.code === 'soc'),
        soh: container.measurePoints.find(point => point.code === 'soh')
      }]; // it is an array
      vm.rightPanelIncludedMarkers = [container]; // it is an array
      // open the nav
      this.openNav();
    },
    mouseClickMarkerCluster(clusterEl) {
      var vm = this;
      const childMarkers = clusterEl.layer.getAllChildMarkers();
      vm.rightPanelIncludedMarkers = childMarkers.map(el => el.options.customObjectContainer);

      var arrayPopin = [];
      vm.numberContainer = childMarkers.length;
      childMarkers.map(el => {
        // get alarms status for this points
        Store.dispatch("sources/getSourceAlarmsEvents", el.id);
        // prepare popin array to display
        arrayPopin.push({
          id: el.options.customObjectContainer.id,
          name: el.options.customObjectContainer.name,
          soc: el.options.customObjectContainer.measurePoints.find(point => point.code === 'soc'),
          soh: el.options.customObjectContainer.measurePoints.find(point => point.code === 'soh')
        });
      });
      // assign to scope
      vm.markerContainers = arrayPopin;
      // open the nav
      vm.openNav();
    },
    generateHtmlTootipMarkerCluster(el) {
      return `Containers : <br> ${el._latlng.lat}, ${el._latlng.lng} `;
    }
  },
  mounted() {
    // getSources for map receive in computed
    this.$store.dispatch('sources/getSources');
  },
  created() {
    var vm = this;
    Vue.nextTick(() => { // wait for dom full ready
      // add listener on clusters to show popin
      vm.$refs.clusterRef.mapObject.on('clusterclick', (el) => {
        throttle(
          vm.mouseClickMarkerCluster(el),
          2000
        );
      })
    });
  }
}
</script>
<style scoped>
  @import "~leaflet/dist/leaflet.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

.sidenav {
    height: 100%;
    width: 0;
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    background-color: #EDF1F5;
    overflow-x: hidden;
    transition: 0.5s;
}

.sidenav a {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 25px;
    color: #818181;
    display: block;
    transition: 0.3s
}

.sidenav a:hover, .offcanvas a:focus{
    color: #f1f1f1;
}

.sidenav .closebtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 36px;
    margin-left: 50px;
}

@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}

.rightPanel-title {
  font-size: 1.3rem;
  color: #818181;
  /*font-weight: bold;*/
  margin-left: 2rem;
  line-height: 2;
}
.rightPanel-title-alarms {
  color: #E20030;
  font-weight: bold;
  margin: auto;
  text-align: right;
  margin-right: 2rem;
}
.table-tr-normal {
  color: black;*
  cursor: pointer;
}
.table-tr-hight {
  color: #E20030;
  cursor: pointer;
}
.table-tr-medium {
  color: #F39800;
  cursor: pointer;
}
.table-tr-low {
  color: #44BE02;
  cursor: pointer;
}
.table-tr-unknow {
  color: #c19a6b;
  cursor: pointer;
}
.rightPanel-notif-icon {
  color: #E20030;
  cursor: pointer;
}
.rightPanel-layout-head {
  margin: 1rem;
  padding-top: 2rem;
  background-color: white;
}
.rightPanel-layout-table {
  padding: 1rem;
}
table tr:nth-child(odd) {
    background: #EDF1F5;
}
</style>