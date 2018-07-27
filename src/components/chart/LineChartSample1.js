/* globals Store */
import 'chart.js'
import { Line, mixins } from 'vue-chartjs'

import { mapState, dispatch, mapGetters } from 'vuex'
const { reactiveData } = mixins

export default Line.extend({
  mixins: [reactiveData],
  data () {
    return {
      gradient: null,
      gradient2: null,
      // chartData: null // created with the mixin reactiveData
    }
  },
  watch: {
    getSampleGraph1DataCurrent: val => {
      // console.log('getSampleGraph1DataCurrent changed');
      this.chartData = val;
    }
  },
  computed: {
    ...mapGetters('samples', [ // for computed property need to be get with actions
      // 'getSampleGraph1DataCurrent',
      'getSampleGraph1DataSoc',
      // 'getSampleGraph1DataTemperature',
      // 'getSampleGraph1DataVoltage',
      'getSampleGraph1DataTimestamp'
    ]),
  },
  created () {
    // console.log('created', this.$refs);
    Store.dispatch('samples/getSampleGraph1').then((then) => {

    this.gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
    this.gradient2 = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)

    this.gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)')
    this.gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.25)');
    this.gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

    this.gradient2.addColorStop(0, 'rgba(0, 231, 255, 0.9)')
    this.gradient2.addColorStop(0.5, 'rgba(0, 231, 255, 0.25)');
    this.gradient2.addColorStop(1, 'rgba(0, 231, 255, 0)');

    this.renderChart({
      labels: this.getSampleGraph1DataTimestamp, // ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        // {
        //   label: 'current',
        //   // borderColor: '#FC2525',
        //   // pointBackgroundColor: 'white',
        //   borderWidth: 0,
        //   pointBorderColor: '#0040ff',
        //   backgroundColor: '#00ffff',
        //   data: this.getSampleGraph1DataCurrent // [40, 39, 10, 40, 39, 80, 40]
        // },
        {
          label: 'soc',
          pointBorderColor: '#ffbf00',
          borderWidth: 0,
          backgroundColor: '#ffff00',
          data: this.getSampleGraph1DataSoc // [60, 55, 32, 10, 2, 12, 53]
        },
        // {
        //   label: 'temperature',
        //   pointBorderColor: '#ff4000',
        //   borderWidth: 0,
        //   backgroundColor: '#ff0000',
        //   data: this.getSampleGraph1DataTemperature // [60, 55, 32, 10, 2, 12, 53]
        // },
        // {
        //   label: 'voltage',
        //   // borderColor: '#790BE1',
        //   pointBorderColor: '#790BE1',
        //   borderWidth: 0,
        //   backgroundColor: '#ff00ff',
        //   data: this.getSampleGraph1DataVoltage // [60, 55, 32, 10, 2, 12, 53]
        // }
      ]
    },
    {responsive: true, maintainAspectRatio: false})
    })
  }
})
