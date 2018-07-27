<template>
  <v-container fill-height justify-center align-center>
    <v-layout column fill-height wrap>
      <v-flex xs12 sm5 md4 lg3>
        <a :href="'https://login.microsoftonline.com/bhcdevtest.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_signup&client_id=2570b55c-f769-43f9-a2d1-8eb4a303fde8&nonce=defaultNonce&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F&scope=openid&response_type=id_token&prompt=login'" target="_new"> Créer un compte</a>
      </v-flex>

      <v-flex xs12 sm5 md4 lg3>
        <v-card class="mt-0 pt-0">
            <v-card-title class="blue darken-1">
              <h4 style="color:white">Vue-EMP Login</h4>
            </v-card-title>
            <v-card-text>
                <form @submit.prevent="login">
  <!--                 <v-layout row wrap>
                    <v-flex xs12 md4 >
                      <v-subheader>User ID</v-subheader>
                    </v-flex>
                    <v-flex  xs12 md8>
                      <v-text-field class="input-group--focused" name="email" v-model="email" label="email" value="Input text"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex  xs12 md4>
                      <v-subheader>Password</v-subheader>
                    </v-flex>
                    <v-flex  xs12 md8>
                      <v-text-field class="input-group--focused" name="password" type="password" v-model="pass" label="password" value="Input text"></v-text-field>
                    </v-flex>
                  </v-layout> -->

                  <v-btn type="submit">login</v-btn>
                  <v-snackbar v-if="error" :timeout="timeout" :top="true" :multi-line="mode === 'multi-line'" :vertical="mode === 'vertical'" v-model="error">
                    {{ text }}
                    <v-btn class="pink--text" flat @click.native="error = false">Close</v-btn>
                  </v-snackbar>
                </form>
          </v-card-text>
        </v-card>
      </v-flex>
      </v-flex>
        loginLoading: {{loginLoading}}, Hello : {{user}}
      </v-flex>
    </v-layout>
    <LoginLoader v-if="loginLoading"></LoginLoader>
  </v-container>
</template>
<script>
// import auth from '../utils/auth'
import AuthService from '../utils/auth';
import LoginLoader from '../components/LoaderSignal.vue';
import { mapState } from "vuex";

export default {
  components: {
    LoginLoader
  },
  data () {
    return {
      email: 'admin@test.com',
      pass: 'password',
      error: false,
      text: '',
    }
  },
  computed: {
    ...mapState('user', {
      loginLoading: 'loginLoading',
      user: 'user',
    }),
  },
  created() {
    // check logged and redirect to home
    if (AuthService.loggedIn()) {
      console.log('created login logginin');
      this.$router.push({
        name: 'Home'
      });
    }
  },
  methods: {
    login () {
      this.$store.dispatch('user/loginAction')
    }
  }
}
</script>
<style lang="stylus">
  @import '../stylus/main'
</style>
