<template>
  <div class="date-range-picker">
    <v-flex class="text-xs-center">
      <v-btn color="info" v-on:click="setDefinedDates('day', 1)">{{$t('daterange.today')}}</v-btn>
      <v-btn color="info" v-on:click="setDefinedDates('day', 7)">{{$t('daterange.next-7-days')}}</v-btn>
      <v-btn color="info" v-on:click="setDefinedDates('day', 30)">{{$t('daterange.next-30-days')}}</v-btn>
      <v-btn color="info" v-on:click="setDefinedDates('month', 1)">{{$t('daterange.current-month')}}</v-btn>
      <v-btn color="info" v-on:click="setDefinedDates('month', 12)">{{$t('daterange.current-year')}}</v-btn>
    </v-flex>
    <v-flex class="text-xs-center">
      <v-btn fab dark small color="info" v-on:click="setNewDates('previous')">
        <v-icon dark>remove</v-icon>
      </v-btn>
      <date-picker v-model="time" range :shortcuts="shortcuts" :lang="lang" confirm :clearable="false"></date-picker>
      <v-btn fab dark small color="info"  v-on:click="setNewDates('next')">
        <v-icon dark>add</v-icon>
      </v-btn>
    </v-flex>
  </div>
</template>

<script>
  /* globals Store */
  import Vue from 'vue'
  import DatePicker from 'vue2-datepicker'

  var addDays = function(date, days) {
    var dat = new Date(date);
    dat.setDate(dat.getDate() + days);
    return dat;
  }

  var addMonth = function(date, months) {
    var d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  export default {
    name: 'date-range-picker',
    props: {
    },
    data () {
      return {
        // time: '', // computed property linked to the store
        step: 'day',
        numberSteps: 1,
        shortcuts: [
          // {
          //   text: 'Today',
          //   onClick: () => {
          //     this.time = [ new Date(), new Date() ];
          //     this.step = 'day';
          //     this.numberSteps = 1;
          //   }
          // },
          // {
          //   text: 'next 7 days',
          //   onClick: () => {
          //     this.time = [ new Date(), addDays(new Date(), 7) ];
          //     this.step = 'day';
          //     this.numberSteps = 7;
          //   }
          // },
          // {
          //   text: 'next 30 days',
          //   onClick: () => {
          //     this.time = [ new Date(), addDays(new Date(), 30) ];
          //     this.step = 'day';
          //     this.numberSteps = 30;
          //   }
          // }
        ],
        timePickerOptions: {
          start: '00:00',
          step: '00:30',
          end: '23:30'
        },
        // lang: this.$i18n.locale.substring(0, 2)
        // {
        //   days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        //   months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        //   pickers: ['next 7 days', 'next 30 days', 'previous 7 days', 'previous 30 days'],
        //   placeholder: {
        //     date: 'Select Date',
        //     dateRange: 'Select Date Range'
        //   }
        // }
      }
    },
    methods: {
      setDefinedDates: function(step, number) {
        if (step === 'day') {
            this.time = [
              new Date(),
              addDays(new Date(), number)
            ]
        } else if (step === 'month') {
          this.time = [
            new Date(),
            addMonth(new Date(), number)
          ]
        }
      },
      setNewDates: function(type, step) {
        if (type === 'next') {
          if (this.step === 'day') {
            this.time = [
              addDays(this.time[0], this.numberSteps),
              addDays(this.time[1], this.numberSteps)
            ]
          }
        } else if (type === 'previous') {
            this.time = [
              addDays(this.time[0], -this.numberSteps),
              addDays(this.time[1], -this.numberSteps)
            ]
        }
      }
    },
    computed: {
      lang: { // daterange picker lang is computed on i18n locale changes (only 'fr', not 'fr-FR')
        get: function() {
          return this.$i18n.locale.substring(0, 2)
        }
      },
      time: {
        get: function() {
          // stored in localstorage with a string, generate a new date from localstorage datas
          return Store.state.daterange.time.map(el => typeof el === 'string' ? new Date(el) : el );
        },
        set: function(val) {
          // begin day 00:00
          var start = new Date(val[0]);
          start.setHours(0, 0, 0, 0);
          // end day 23:59
          var end = new Date(val[1]);
          end.setHours(23, 59, 59, 999);
          val[0] = start;
          val[1] = end;
          Store.commit("daterange/setTime", val);
          Store.dispatch('sources/getContainerInfos');
          Store.dispatch('sources/getSourceAlarmsEvents');
        }
      }
    },
    components: {
      DatePicker
    }
  }
</script>
<style scoped>
  .date-range-picker {
    margin: auto;
  }
</style>