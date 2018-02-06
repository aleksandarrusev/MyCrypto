// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import {store} from "./store/store"
import * as firebase from "firebase"

Vue.use(VueResource);

import router from './router'

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>', 
  created() {
    var config = {
      apiKey: "AIzaSyDQpJPyjNqo-xtXI8AT5YSXHiP2tfPZzq8",
      authDomain: "crypto-folio-7b954.firebaseapp.com",
      databaseURL: "https://crypto-folio-7b954.firebaseio.com",
      projectId: "crypto-folio-7b954",
      storageBucket: "crypto-folio-7b954.appspot.com",
      messagingSenderId: "387848486561"
    };
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
