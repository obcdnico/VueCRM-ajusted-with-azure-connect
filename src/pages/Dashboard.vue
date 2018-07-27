<template>
  <v-container id="dashboard" fluid grid-list-lg class="mx-0 pa-0">
    <v-layout row wrap>
      <date-range-picker></date-range-picker>
    </v-layout>
    <v-layout class="pt-1 px-1" row wrap>
      <v-flex xs12>
        <v-card light class="Chart">
          <highchart-sample2
            v-if="getMultipleGraphDatas.length"
            :graphDatas="getMultipleGraphDatas"
            :alarmsEvents="getAlarmsEvents">
          </highchart-sample2>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card light class="Chart">
          <!-- <highchart-sample1></highchart-sample1> -->
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  /* globals Store */
  import HighchartSample2 from "../components/HighchartSample2.vue";
  import DateRangePicker from '../components/DateRangePicker'
  import { mapGetters } from "vuex";

  export default {
    name: "Dashboard",
    data() {
      return {
      };
    },
    computed: {
      ...mapGetters("sources", {
        'getMultipleGraphDatas': 'getMultipleGraphDatas',
        'getAlarmsEvents': 'getAlarmsEvents'
      })
    },
    components: {
      DateRangePicker,
      HighchartSample2
    },
    created() { // fetch container infos on created
      Store.dispatch("sources/getContainerInfos", this.$router.currentRoute.params.id);
      Store.dispatch("sources/getSourceAlarmsEvents", this.$router.currentRoute.params.id);
    },
    mounted() {
      // get graph datas from external api
      // Store.dispatch("samples/getGraphDataFromApi");
    }
  };
</script>
<style scoped>
  #dashboard .flex {
    margin-bottom: 2px;
  }
</style>
