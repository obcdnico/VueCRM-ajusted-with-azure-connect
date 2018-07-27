<template>
    <section class="charts">
        <div v-for="graph in graphDatas" :id="'hichart_' + graph.yAxisText" style="height: 150px;"></div>
    </section>
</template>
<script>
/* globals Store */
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";
import Highcharts from "highcharts/highstock";
import debounce from '../helpers/debounce';

if (!Highcharts) {
  Exporting(Highcharts);
  ExportData(Highcharts);
}

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
var deboucedFct =
function (e) {
  // console.log('e', e);
  var chart,
      point,
      i,
      event;
  for (i = 0; i < Highcharts.charts.length; i = i + 1) {
      chart = Highcharts.charts[i];
      // Find coordinates within the chart
      event = chart.pointer && chart.pointer.normalize(e);
      // console.log('event', event);
      // Get the hovered point
      point = chart.series && chart.series[0].searchPoint(event, true);
      if (point) {
          point.highlight(e);
      }
  }
}

function setSeverityColor(alarm) {
  if (alarm.data.severity === 3) {
    return '#ffb4b4';
  } else if (alarm.data.severity === 2) {
    return '#fcc47b';
  } else {
    return '#00e8da';
  }
}

export default {
  name: 'HighchartSample2',
  components: {},
  watch: {
    graphDatas: {
      handler: function(newVal, oldVal) { // watch it
        if (newVal !== oldVal) {
          for (var i = newVal.length - 1; i >= 0; i--) {
            const identifier = 'hichart_' + newVal[i].yAxisText;
            this.currentGraphs[identifier].series[0].setData(newVal[i].data);
          }
        }
        this.resetZoom(); // rest zoom on updated datas
      },
      deep: true // watch deep array of objects
    },
    alarmsEvents: {
      handler: function(newVal, oldVal) { // watch it
        var vm = this;
        if (newVal !== oldVal) {
          vm.removePlotBands();
          // add plotBand to graph
          for (let i = newVal.length - 1; i >= 0; i--) {
            for (let j in vm.currentGraphs) {
              // add plotBand on graph
              var plotBand = vm.currentGraphs[j].xAxis[0].addPlotBand({
                  from: newVal[i].start,
                  to: newVal[i].end,
                  color: setSeverityColor(newVal[i]),
                  id: newVal[i].id,
                  borderWidth: 1,
                  label: {
                    text: `<span>${newVal[i].eventType}</span>`,
                    align: 'center',
                    x: 0,
                    useHTML: true,
                    verticalAlign: 'top',
                    style: {
                      color: 'black',
                      fontWeight: 'bold'
                    }
                  },
                  events: {
                    mouseover: function (e) {
                      console.log('mousehover');
                    }
                  }
              });
              // console.log('plotBand', plotBand);
              vm.currentPlotBandsIds.push(newVal[i].id); // push id to remo it later
              // add circle shapes on plotband
              // vm.generatePlotBandCircleShape(vm.currentGraphs[j], plotBand, newVal[i]);
            }
          }

        }
      },
      deep: true // watch deep array of objects
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
    alarmsEvents: {
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
      graphHtmlTags: [],
      currentGraphs: [],
      currentPlotBandsIds: []
    };
  },
  computed: {
  },
  mounted() {
    var vm = this;
    for (var i = vm.graphDatas.length - 1; i >= 0; i--) {
      vm.graphHtmlTags.push(document.querySelector('#' + 'hichart_' + vm.graphDatas[i].yAxisText));
    }
    this.createMultipleCharts();
  },
  beforeDestroy() {
    var vm = this;
    for (let i = vm.graphHtmlTags.length - 1; i >= 0; i--) {
      vm.graphHtmlTags[i].removeEventListener("mouseover", deboucedFct, false);
    }
    for (let i in vm.currentGraphs) {
      vm.currentGraphs[i].destroy();
    }
    // reaasign master object if some are undefined
    Highcharts.charts = Highcharts.charts.filter(function(n){ return n !== undefined });
  },
  methods: {
    generatePlotBandCircleShape(graph, plotBand, alarm) {

      // console.log('plotBand', plotBand);
      // console.log('alarm', alarm);

      // var text = graph.renderer.text(
      //         '',
      //         plotBand.svgElem.renderer.plotBox.x, // + graph.plotLeft,
      //         plotBand.svgElem.renderer.plotBox.y
      //     ).attr({
      //         zIndex: 5
      //     }).add();
      // var box = text.getBBox();
      // first circle
      // graph.renderer.circle(
      //   plotBand.svgElem.renderer.plotBox.x + 10,
      //   plotBand.svgElem.renderer.plotBox.y,
      //   5
      // )
      // .attr({
      //     fill: 'red',
      //     stroke: 'gray',
      //     'stroke-width': 1,
      //     zIndex: 4
      // })
      // .add();
      // // second circle
      // graph.renderer.circle(
      //   graph.xAxis[0].toPixels(plotBand.svgElem.renderer.plotBox.width + plotBand.svgElem.renderer.plotBox.x),
      //   // plotBand.svgElem.renderer.plotBox.width / 10, // + plotBand.svgElem.renderer.plotBox.width,
      //   plotBand.svgElem.renderer.plotBox.y,
      //   5
      // )
      // .attr({
      //     fill: 'red',
      //     stroke: 'gray',
      //     'stroke-width': 1,
      //     zIndex: 5
      // })
      // .add();
    },
    removePlotBands() {
      var vm = this;
      // remove old plotbands to avoid supperposition
      for (let j in vm.currentGraphs) {
        vm.currentPlotBandsIds.map(el => {
          vm.currentGraphs[j].xAxis[0].removePlotBand(el);
          return el;
        })
      }
    },
    resetZoom() {
      var vm = this;
      for (var i in vm.currentGraphs) {
        // vm.currentGraphs[i].xAxis[0].setExtremes(null, null);
        vm.currentGraphs[i].zoomOut();
      }
    },
    createMultipleCharts() {
      // generate finals graphs
      this.$nextTick(() => {
        for (var i = this.graphDatas.length - 1; i >= 0; i--) {
          this.createChart(this.graphDatas[i]);
        }
      });

      // apply resize action for chart on windows resize
      function resized() {
        Highcharts.charts.forEach(function(chart) {
          chart.reflow(); // reflow chart when windows is resized
        });
      }
      // window resize
      window.onresize = function(){ debounce(resized(), 50); }

    },
    createChart(localGraphDatas) {
      var vm = this;
      var tickPositionerFct = void 0;

      // if (Highcharts.charts[0]) {
      //   tickPositionerFct = function () {
      //         return Highcharts.charts[0].get('axis1').tickPositions.slice();
      //       }
      // }

        // plotBand Ternary whooohoooo
        const plotBands =
        localGraphDatas.length > 1
        ? {
          color: '#ffedcc', // Color value
          from: localGraphDatas[0][0], // Start of the plot band (with timastamp)
          to: localGraphDatas.length ? localGraphDatas[localGraphDatas.length / 2][0] : null // End of the plot band
          }
        : [{}];


        const identifier = 'hichart_' + localGraphDatas.yAxisText;
        const currentGraph = Highcharts.chart(identifier, {
          chart: {
            type: 'spline',
            zoomType: null, // 'x'
            redraw: function() {
              var xAxis = this.xAxis[0];
              var yAxis = this.yAxis[0];
              // this.rectangles.forEach(function (rect) {
              //    var x1 = xAxis.toPixels(rect.start),
              //        x2 = xAxis.toPixels(rect.len),
              //        y1 = yAxis.toPixels(rect.ystart),
              //        y2 = yAxis.toPixels(rect.yend);
              //   rect.element.attr({
              //     x: x1,
              //     y: y2,
              //     width: x2 - x1,
              //     height: y1 - y2
              //   });
              // });
            },
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
              enabled: localGraphDatas.xAxisEnabled || vm.xAxisEnabled,
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
              text: localGraphDatas.yAxisText || vm.yAxisText,
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
                enabled: true // no dot on value
              }
            }
          },
          colors: ['#696969', '#39F', '#06C', '#036', '#000'], // color for multiple lines datas
          // Define the data points. All series have a dummy year
          // of 1970/71 in order to be compared on the same x axis. Note
          // that in JavaScript, months start at 0 for January, 1 for February etc.
          series: [{
            lineWidth: 1.5,
            name: localGraphDatas.yAxisText || vm.yAxisText,
            data: localGraphDatas.data,
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

        // add it to reference on data field
        vm.currentGraphs[identifier] = currentGraph;
        // mouseover is debounced to not stress the browser
        for (var i = vm.graphHtmlTags.length - 1; i >= 0; i--) {
          vm.graphHtmlTags[i].addEventListener("mouseover", deboucedFct, false);
        }
    },
  }
};
</script>
