import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    availableCryptos: ['Bitcoin', 'Ethereum', 'Ripple', 'Litecoin', 'DASH', 'Bitcoin-Cash', 'Cardano', 'Monero', 'Stellar', 'IOTA'],
    loggedUser: null,
    total: 0,
    loading: true,
    currentValue: {},
  },
  getters: {
    user: function (state) {
      return state.loggedUser
    },
    total: function(state) {
      return state.total;
    }

  },
  mutations: {
    setTotal(state, payload) {
      state.total = payload;
    },
    setUser(state, payload) {
      state.loggedUser = payload
    },
    setCurrencyData(state, payload) {
      let currentItem = state.loggedUser.portfolio[payload.index];
      currentItem.price = payload.price;
      currentItem.value = payload.value;
    },
    addItem(state, payload) {
      state.loggedUser.portfolio.push({
        key: payload.key,
        name: payload.name,
        quantity: payload.quantity,
        editable: false
      })
    },
    updateQuantity(state, payload) {
      let item = payload.item;
      item.quantity = payload.quantity;
    },
    deleteItem(state, payload) {
      let found = state.loggedUser.portfolio.find(function (item) {
        return item.key === payload.key;
      })
      let index = state.loggedUser.portfolio.indexOf(found);
      state.loggedUser.portfolio.splice(index, 1);
    }
  },
  actions: {
    signup: function ({
      commit
    }, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(
        function (user) {
          let newUser = {
            id: user.uid,
            fullname: payload.fullname,
            portfolio: [],
          };
          //add user to the users table
          firebase.database().ref('users/' + user.uid).set({
            portfolio: [],
            fullname: payload.fullname,
          }).then(function () {
            console.log("user created successfully")
          });

          //add user to the state
          commit('setUser', newUser);
        }
      ).catch(
        function (error) {
          console.log(error.message)
        }
      )
    },
    signIn: function ({
      commit,
      actions
    }, payload) {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).then(
        function (user) {
          firebase.database().ref('users').child(user.uid).once('value').then((snapshot) => {
            let portfolioRaw = snapshot.val().portfolio;
            let portfolio = [];
            for (const item in portfolioRaw) {
              let portfolioItem = {
                key: item,
                name: portfolioRaw[item].name,
                quantity: portfolioRaw[item].quantity,
                editable: false
              };

              portfolio.push(portfolioItem)
            }

            let newUser = {
              id: user.uid,
              fullname: snapshot.val().fullname,
              portfolio: portfolio,
            };
            commit('setUser', newUser);
          })
        }
      ).catch(
        function (error) {
          console.log(error.message)
        }
      )
    },
    signOut: function ({
      commit,
      getters
    }) {
      firebase.auth().signOut().then(function (user) {
        commit('setUser', null);
      })
    },
    addItem: function ({
      commit,
      dispatch,
      state,
      getters
    }, payload) {
      let uid = getters.user.id;
      let found = getters.user.portfolio.find((item) => item.name === payload.name);
      let foundKey = "";
      if(found) {
        foundKey = found.key;
      }
      //   console.log(found)
      return new Promise((res, rej) => {
        if (!found) {
          firebase.database().ref('users/' + uid + '/portfolio/').push({
            name: payload.name,
            quantity: payload.quantity
          }).then((data) => {
            commit('addItem', {
              key: data.key,
              name: payload.name,
              quantity: payload.quantity
            })
            res();
          });
        } else {
          dispatch("updateItem", payload).then(() => { res() });
        }
      })
    },
    updateItem: function ({
      commit, getters
    }, payload) {
      const uid = getters.user.id;
      const item = getters.user.portfolio.find((item) => item.name === payload.name);
      const foundKey = item.key;
      let quantitySum;
      if(!payload.newValue) {
        quantitySum = Number(payload.quantity) + Number(item.quantity);
      } else {
        quantitySum = payload.quantity
      }
      return new Promise ((res, rej) => {
        firebase.database().ref('users/' + uid + '/portfolio/').child(foundKey).update({
          quantity: quantitySum
        }).then(() => {
          console.log(item);
          console.log(quantitySum);
          let obj = {
            item: item,
            quantity: quantitySum,
          }
          console.log(obj);
          commit('updateQuantity', obj)
          res();
        }).catch(() => {
          console.log("bad request :(")
        });
      })

      //find it in the database and update it;
      //commit to the state
    },
    deleteItem: function ({
      commit,
      state,
      getters
    }, payload) {
      return new Promise((res, rej) => {
        firebase.database().ref('users/' + getters.user.id + '/portfolio/').child(payload.key).remove()
          .then(() => {
            commit('deleteItem', payload);
            res();
          })
      })
    },
    loadCryptoInformation: function ({
      commit
    }, payload) {
      // console.log(payload);
      commit("setCurrencyData", payload);
    }
  },
}, )
