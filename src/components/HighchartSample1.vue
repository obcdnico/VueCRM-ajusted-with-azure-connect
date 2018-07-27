<template>
    <section class="charts">
        <div :id="graphId" style="height: 150px;"></div>
    </section>
</template>
<script>
/* globals Store */
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";
import Highcharts from "highcharts/highstock";
import debounce from '../helpers/debounce';

Exporting(Highcharts);
ExportData(Highcharts);

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};
/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {
    return undefined;
};

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
    var thisChart = this.chart;

    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.each(Highcharts.charts, function (chart) {
            if (chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(
                        e.min,
                        e.max,
                        undefined,
                        false,
                        { trigger: 'syncExtremes' }
                    );
                }
            }
        });
    }
}
var deboucedFct = debounce(function (e) {
  var chart,
      point,
      i,
      event;
  for (i = 0; i < Highcharts.charts.length; i = i + 1) {
      chart = Highcharts.charts[i];
      // Find coordinates within the chart
      event = chart.pointer && chart.pointer.normalize(e);
      // Get the hovered point
      point = chart.series && chart.series[0].searchPoint(event, true);
      if (point) {
          point.highlight(e);
      }
  }
}, 2);

export default {
  name: 'HighchartSample1',
  components: {},
  watch: {
    graphDatas: function(newVal, oldVal) { // watch it
      // update the graph data if updated
      const identifier = 'hichart_' + this._uid;
      if (newVal !== oldVal) {
        this.currentGraph.series[0].setData(newVal);
      }
    }
  },
  props: {
    titleText: {
      default: function () {
        return null;
      }
    },
    subtitleText: {
      default: null
    },
    xAxisCategories: {
      default: function() {
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      }
    },
    yAxisText: {
      default: function () {
        return '';
      }
    },
    labelsFormatterText: {
      default: ''
    },
    graphDatas: {
      default: function() {
        return [];
      }
    },
    legendEnabled: {
      default: false
    },
    xAxisEnabled: {
      default: false
    }
  },
  data() {
    var vm = this;
    return {
      graphId: 'hichart_' + this._uid,
      graphHtmlTag: null,
      currentGraph: null
    };
  },
  computed: {
  },
  mounted() {
    var vm = this;
    vm.graphHtmlTag = document.querySelector('#' + vm.graphId);
    this.createChart();
  },
  beforeDestroy() {
    var vm = this;
    vm.graphHtmlTag.removeEventListener("mouseover", deboucedFct, 10);
    this.currentGraph.destroy();
    // reaasign if some are undefined
    Highcharts.charts = Highcharts.charts.filter(function(n){ return n !== undefined });
  },
  methods: {
    createChart() {
      var vm = this;
      var tickPositionerFct = void 0;


      // if (Highcharts.charts[0]) {
      //   tickPositionerFct = function () {
      //         return Highcharts.charts[0].get('axis1').tickPositions.slice();
      //       }
      // }

      this.$nextTick(() => {

        const plotBands = [{
          color: '#ffedcc', // Color value
          from: vm.graphDatas[0][0], // Start of the plot band (with timastamp)
          to: vm.graphDatas[2][0] // End of the plot band
        }];

        vm.currentGraph = Highcharts.chart(vm.graphId, {
          chart: {
            type: 'spline',
            zoomType: 'x' // null // 'x'
          },
          marginLeft: 150,
          legend: {
            enabled: vm.legendEnabled,
            floating: true,
            labelFormatter: function() {
              return this.name;
            }
          },
          credits: {
            enabled: false
          },
          title: {
            text: vm.titleText,
          },
          subtitle: {
            text: vm.subtitleText
          },
          xAxis: {
            tickPositioner: tickPositionerFct,
            title: {
              enabled: false,
              text: 'Date'
            },
            crosshair: true,
            events: {
                setExtremes: syncExtremes
            },
            labels: {
              enabled: vm.xAxisEnabled,
              // format: '{value}' + vm.labelsFormatterText // use this break the auto datetime
            },
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
              month: '%e. %b',
              year: '%Y'
            },
            plotBands: plotBands, // list of defined plotband passed as data ???
          },
          yAxis: {
            offset: 20,
            labels: {
              reserveSpace: false,
              x: 15,
              // useHTML: true,
              // formatter: function() {
              //   return '<span style="min-width:3rem;overflow:hidden">' + this.value + '</span>';
              // }
            },
            title: {
              text: vm.yAxisText,
              enabled: true
            },
            // min: 0 // no min for negatives values
          },
          tooltip: {
              positioner: function () {
                  return {
                      // right aligned
                      x: this.chart.chartWidth - this.label.width,
                      y: 10 // align to title
                  };
              },
              borderWidth: 0,
              backgroundColor: 'none',
              pointFormat: '{point.y}',
              headerFormat: '',
              shadow: false,
              shared: false,
              split: false,
              style: {
                  fontSize: '18px'
              },
              valueDecimals: 0
          },

          plotOptions: {
            area: {
              fillOpacity: 0.75
            },
            spline: {
              marker: {
                enabled: false // no dot on value
              }
            }
          },
          colors: ['#696969', '#39F', '#06C', '#036', '#000'], // color for multiple lines datas
          // Define the data points. All series have a dummy year
          // of 1970/71 in order to be compared on the same x axis. Note
          // that in JavaScript, months start at 0 for January, 1 for February etc.
          series: [{
            lineWidth: 1.5,
            name: vm.yAxisText,
            data: vm.graphDatas,
            states: {
              hover: {
                lineWidth: 1.5
              }
            }
          }
            // ,{ name: "Winter 2015-2016", data: [ [Date.UTC(1970, 10,  9), 0] ]}
          ],
          navigation: {
            buttonOptions: {
              enabled: false
            }
          }
        });

        // mouseover is debounced to not stress the browser
        vm.graphHtmlTag.addEventListener("mouseover", deboucedFct, 20);

        // resize chart on windows resize
        function resized() {
          Highcharts.charts.forEach(function(chart) {
            chart.reflow(); // reflow chart when windows is resized
          });
        }
        // window resize
        window.onresize = function(){ debounce(resized(), 50); }
      });
    },
  }
};
</script>
