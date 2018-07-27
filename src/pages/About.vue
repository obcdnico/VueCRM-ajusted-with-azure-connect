<template>
  <v-flex xs12>
    <p class="text-lg-center display-1">About</p>
  
    <p class="text-xs-center display-2">Vue 2 CRM </p>
  
    <p class="text-xs-center title">Version 1.7</p>
		<Fireworks></Fireworks>
  </v-flex>

</template>
<script>

  import Fireworks from '../components/Fireworks.vue'

  export default {
   components: {
      Fireworks
    },
    data () {
     return {}
    },
    methods: {
    },
    computed: {
    },
    created () {
    },
    mounted () {
    }
  }

</script>