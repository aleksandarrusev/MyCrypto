// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import {
  store
} from "./store/store"
import * as firebase from "firebase"
import config from "./firebase/config"

Vue.use(VueResource);

import router from './router'

Vue.config.productionTip = false

Vue.filter('toFixed', function (value) {
    return value.toFixed(2);
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>',
  created() {
    firebase.initializeApp(config);

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$router.push('/')
      } else {
        this.$router.push('/signin')
      }
    });
  }
})
