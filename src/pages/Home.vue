<template>
  <v-container id="dashboard" fluid grid-list-lg class="mx-0 pa-0">
    <v-layout row wrap align-center justify-space-around row class="home-header">
        <v-card light>
          <v-container fluid grid-list-sm dark>
            <v-layout class="mt-0 mb-0 mx-1" row wrap>
                  <v-flex sm9 xs12>
                    <v-layout class="mt-2 mb-0 pa-0" row wrap>
                      <v-flex d-flex xs12>
                        <v-chip>
                          <div class="round-button">{{getNumberOfSources}}</div>
                          {{$t('side-menu.Containers')}}
                        </v-chip>
                      </v-flex>
                    </v-layout>
                  </v-flex>
            </v-layout>
          </v-container>
        </v-card>
        <v-card light>
          <v-container fluid grid-list-sm dark wrap class="home-state-of-health-container">
            <v-layout class="mt-0 mb-0 mx-1 home-state-of-health-layout" row wrap justify-space-around>

                          <v-layout column>
                            <div class="home-state-of-health-left-text">
                              {{$t('home.state-of-health')}}
                            </div>
                            <div class="home-state-of-health-left-number">
                              68 %
                            </div>
                          </v-layout>
                          <v-layout column class="home-state-of-health-right-layout">
                          
                            <div class="home-state-of-health-right-text">-0.4%</div>
                            <v-icon class="home-state-of-health-right-icon">trending_down</v-icon>
                          </v-layout>


            </v-layout>
          </v-container>
        </v-card>
        <v-card light>
          <v-container fluid grid-list-sm dark>
            <v-layout class="mt-0 mb-0 mx-1" row wrap>
                  <v-flex sm9 xs12>
                   <div class="text-xs-center"><span class="home-available-power-number">XXX</span><span class="home-available-power-units">MW</span></div>
                   <div class="home-available-power-text text-xs-center">Total available power</div>
                  </v-flex>
            </v-layout>
          </v-container>
        </v-card>
    </v-layout>
    <v-layout class="pt-1 px-1" row wrap>
      <v-flex xs12>
        <v-card light class="Chart">
          <leaflet-map></leaflet-map>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  /* globals Store */
  import LeafletMap from "../components/LeafletMap.vue";
  import { mapGetters } from "vuex";

  export default {
    name: "Dashboard",
    data() {
      return {
      };
    },
    computed: {
      ...mapGetters("sources", {
        'getNumberOfSources': 'getNumberOfSources'
      })
    },
    components: {
      LeafletMap
    },
    mounted() {
    }
  };
</script>
<style scoped>

.round-button {
    display:block;
    width:50px;
    height:50px;
    line-height:50px;
    border: 2px solid #f5f5f5;
    border-radius: 50%;
    color:#f5f5f5;
    text-align:center;
    text-decoration:none;
    background: #464646;
    box-shadow: 0 0 3px gray;
    font-size:20px;
    font-weight:bold;
}
.round-button:hover {
    background: #262626;
}
.home-header {
  padding: 1rem;
  background: #f5f5f5;
}
.home-state-of-health-container {
  padding: 2rem;
}
.home-state-of-health-layout {
  width: 15rem;
}
.home-state-of-health-right-layout {
  text-align: center;
}
.home-state-of-health-left-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #7D7064;
}
.home-state-of-health-left-number {
  font-size: 3rem;
  font-weight: bold;
  color: #7D7064
}
.home-state-of-health-right-icon {
  font-size: 4rem;
  color: red;
}
.home-state-of-health-right-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: red;
}
.home-available-power-number {
  font-size: 2rem;
}
.home-available-power-units {
  font-size: 0.9rem; 
}
.home-available-power-text {
  font-size: 1.1rem;
  width: 11rem;
}
</style>
