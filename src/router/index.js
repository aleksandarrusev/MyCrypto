import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import market from '@/components/market'
import signin from '@/components/auth/signin'
import signup from '@/components/auth/signup'
import * as firebase from 'firebase'
import {
  store
} from '@/store/store'


Vue.use(Router)

let router = new Router({
  mode: "history",
  routes: [{
      path: '/',
      name: 'market',
      component: market,
      beforeEnter: (to, from, next) => {
        if (!store.state.loggedUser) {
          next("/signin")
        } else {
          next()
        }
      }
    },
    {
      path: '/signout',
      name: 'home',
      redirect: "/signin"
    },
    {
      path: '/signin',
      name: 'signin',
      component: signin
    },
    {
      path: '/signup',
      name: 'signup',
      component: signup
    },

  ]
})

// router.beforeEach((to, from, next) => {
//   let currentUser = firebase.auth().currentUser;
//   let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

//   if (requiresAuth && !currentUser) {
//       next({path: '/signin'})
//   }else if (requiresAuth && currentUser) {
//       next();
//   } else {
//       next(to);
//   }

// })

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     // this route requires auth, check if logged in
//     // if not, redirect to login page.
//     if (!auth.loggedIn()) {
//       next({
//         path: '/login',
//         query: { redirect: to.fullPath }
//       })
//     } else {
//       next()
//     }
//   } else {
//     next() // make sure to always call next()!
//   }

export default router

