<template>
  <v-app>
    <vue-progress-bar>
    </vue-progress-bar>
    <template v-if="!loggedIn">
      <router-view></router-view>
    </template>
    <template v-if="loggedIn">
      <v-navigation-drawer absolute temporary width="250" light :mini-variant="mini" v-model="drawer" :disable-resize-watcher="true" :permanent="true" :disable-route-watcher="true" app>
        <!-- mini-variant.sync="true" -->
        <v-list class="pa-0">
          <v-list-tile avatar tag="div">
            <v-list-tile-action class="pr-1 pl-2 mr-1" style="margin:0.5rem;">
              <img src="/assets/img/logo.png">
              <!-- <img v-if="mini" src="/assets/img/android-chrome-144x144.png" style="height: 3rem;"> -->
            </v-list-tile-action class="pr-1 pl-2 mr-1">
          </v-list-tile>
        </v-list>
        </v-list>
          <v-list-tile>
            <v-list-tile-avatar>
              <img src="/assets/img/avatar0.png">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-if="user">{{user.name}}</v-list-tile-title>
            </v-list-tile-content>
            <v-spacer></v-spacer>

            <v-list-tile-action v-if="!mini" style="min-width:30px;">
              <v-menu bottom right offset-y origin="bottom right" transition="v-slide-y-transition">
                <v-btn icon light slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile v-for="item in userMenus" :key="item.title" value="true" :to="item.link" router>
                    <v-list-tile-title v-text="item.title"></v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>

            </v-list-tile-action>
            <v-list-tile-action v-if="!mini" style="min-width:30px;">
              <v-btn icon @click.native.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>

        </v-list>
        <v-list>
          <v-list-tile v-for="item in items" :key="item.title" @click="clickMenu(item)" router>
            <v-list-tile-action class="pr-1 pl-2 mr-1">
              <v-icon :class="activeMenuItem.includes(item.title)?'blue--text': ''" :title="item.title" light v-html="item.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content :class="activeMenuItem.includes(item.title)?'blue--text': ''">
              <v-list-tile-title v-text="$t('side-menu.'+item.title)"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar app="">
        <v-toolbar-side-icon @click.native.stop="drawer = !drawer; mini = !mini" light></v-toolbar-side-icon>
        <v-breadcrumbs divider="/">
          <v-breadcrumbs-item
            v-for="item in breadcrumbsItems"
            :key="item.text"
            :disabled="item.disabled"
            :href="item.href"
          >
            {{ item.needTranslate ? $t('side-menu.'+item.text) : item.text }}
          </v-breadcrumbs-item>
        </v-breadcrumbs>

        <v-spacer></v-spacer>
        <div class="text-xs-center pr-3">
          <LangChanger></LangChanger>
        </div>
        <div class="text-xs-center pr-3">
          <v-badge color="red">
            <span slot="badge">!</span>
            <v-icon large color="green">notification_important</v-icon>
            <v-icon v-if="false" large color="red">notification_important</v-icon>
          </v-badge>
        </div>
<!--         <v-btn light flat  href="https://github.com/harryho/vue2crm" target="_blank">
              <svg height="30" class="octicon octicon-mark-github" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
          <span style="margin-left:0.4rem;">GitHub</span>
        </v-btn> -->
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <v-layout>
            <v-flex row="">
              <router-view></router-view>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
      <!-- <canvas id="canvas"></canvas> -->
      <v-footer :inset="true" style="justify-content:center; text-align: center" app>
        <span>&copy; Vue-CRM 2018</span>
      </v-footer>
    </template>
  </v-app>

</template>
<script>
import LangChanger from "./components/LangChanger.vue";
import AuthService from './utils/auth';
import { mapState } from "vuex";

export default {
  data () {
    return {
      dialog: false,
      mini: true,
      dialogText: "",
      dialogTitle: "",
      // loggedIn: AuthService.loggedIn(),
      isRootComponent: true,
      clipped: true,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: "home",
          title: 'Home',
          vertical: "Home",
          link: "home",
          disabled: true
        },
        {
          icon: "dashboard",
          title: 'ContainersList',
          vertical: "ContainersList",
          link: "containers"
        },
        // {
        //   icon: "shopping_cart",
        //   title: 'Orders',
        //   vertical: "Order",
        //   link: "orders",
        //   disabled: true
        // },
        {
          icon: "perm_identity",
          title: 'Customers',
          vertical: "Customer",
          link: "customers",
          disabled: true
        },
        // {
        //   icon: "bubble_chart",
        //   title: 'Products',
        //   vertical: "Product",
        //   link: "products",
        //   disabled: true
        // },
        {
          icon: "thumbs_up_down",
          title: 'About',
          vertical: "About",
          link: "about",
          disabled: true
        }
      ],
      userMenus: [
        {
          icon: "bubble_chart",
          title: "Logout",
          link: "/logout"
        },
        {
          icon: "bubble_chart",
          title: "Change Password",
          link: "/changepassword"
        }
      ],
      miniVariant: true,
      right: true,
      rightDrawer: false,
      menuItem: "Orders",
      breadcrumbsItems: []
    };
  },
  watch: {
    $route (to){ // listen route change to set the header color menu
      console.log('watch route to', to);
      this.generateBreadcrums(to);
    }
  },
  created () {
    // AuthService.onChange = loggedIn => {
    //   console.log("app vue onChange loggedIn", loggedIn);
    //   this.loggedIn = loggedIn;
    // };
    //  [App.vue specific] When App.vue is first loaded start the progress bar
    this.$Progress.start();
    //  hook the progress bar to start before we move router-view
    this.$router.beforeEach((to, from, next) => {
      //  does the page we want to go to have a meta.progress object
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress;
        // parse meta tags
        this.$Progress.parseMeta(meta);
      }
      //  start the progress bar
      this.$Progress.start();
      //  continue to next page
      next();
    });
    //  hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach((to, from) => {
      if (to.name !== "ErrorPage") {
        this.menuItem = to.name;
      }
      //  finish the progress bar
      this.$Progress.finish();
    });
  },
  computed: {
    ...mapState('user', {
      user: 'user',
      loggedIn: 'loggedIn'
    }),
    activeMenuItem() {
      return this.menuItem;
    }
  },
  methods: {
    generateBreadcrums(to) {
      if (to.name === 'Containers') {
        this.breadcrumbsItems[0] = {text: to.name, href: '/containers', disabled: false, needTranslate: true};
        this.breadcrumbsItems[1] = {text: to.params.id, href: to.path, disabled: false, needTranslate: false};
      } else {
        this.breadcrumbsItems[0] = {text: to.name, href: to.path, disabled: false, needTranslate: true};
        this.breadcrumbsItems[1] && this.breadcrumbsItems.splice(1, 2); // delete 2nd part of breadcrums
      }
    },
    clickMenu(item) {
      this.menuItem = item.title;
      console.log('this.menuItem', this.menuItem);
      // disallow naviguation for this items (demo case)
      // if (this.menuItem === 'Orders' || this.menuItem === 'Customers' || this.menuItem === 'Products' || this.menuItem === 'About') {
      //   return;
      // }
      this.$router.push({
        name: item.title
      });
    },
  },
  mounted () {
    this.$Progress.finish();
    // init breadcrubms
    this.generateBreadcrums(this.$router.currentRoute);
  },
  components: {
    LangChanger
  }
};
</script>
<style lang="stylus">
  @import './stylus/main';
</style>
