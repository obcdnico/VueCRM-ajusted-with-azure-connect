<template>
  <Dropdown :options="arrayOfObjects"
            :selected="object"
            v-on:updateOption="methodToRunOnSelect"
            :placeholder="'Select an Item'">
  </Dropdown>
</template>

<script>
import Dropdown from './Dropdown.vue';

export default {
  data() {
    return {
      arrayOfObjects: [
        {name: 'Français', value: 'fr-FR'},
        {name: 'Anglais', value: 'en-GB'},
      ],
      object: {
        name: 'Français', value: 'fr-FR'
      }
    }
  },
  components: {
    Dropdown
  },
  methods: {
    methodToRunOnSelect(payload) {
      this.object = payload;
      // set lang in global store
      this.$store.dispatch('lang/setLang', payload.value)
    }
  }
}
</script>
