<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          {{ $t('side-menu.ContainersList') }}
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="listContainers"
          :search="search"
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.id }}</td>
            <td class="text-xs-right">{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.latitude }}</td>
            <td class="text-xs-right">{{ props.item.longitude }}</td>
            <td class="text-xs-right">
              <v-btn class="blue-grey text-xs-center" fab small dark v-on:click="clickOnListElement(props.item)">
                <v-icon>search</v-icon>
              </v-btn>
            </td>
          </template>
          <template slot="pageText" slot-scope="props">
            Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script>
/* globals Store */
import { mapState } from "vuex";

export default {
  components: {
  },
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'ID',
          align: 'center',
          sortable: true,
          value: 'id',
        },
        { text: 'Name', value: 'name', align: 'center' },
        { text: 'Lat', value: 'latitude', align: 'center' },
        { text: 'Long', value: 'longitude', align: 'center' },
        { text: 'Visualiser', value: null, align: 'center', sortable: false }
      ],
    }
  },
  methods: {
    clickOnListElement(container) {
      this.$router.push({
        name: 'Containers',
        params: {id: container.id}
      });
    }
  },
  computed: {
    ...mapState("sources", {
      listContainers: "listContainers",
      pagination: "pagination",
      loading: "loading",
      mode: "mode",
      snackbar: "snackbar",
      notice: "notice"
    }),
  },
  created () {
    // Store.dispatch("sources/getAllCustomers")
  },
  mounted () {
    // this.getCustomers()
  }
}
</script>
