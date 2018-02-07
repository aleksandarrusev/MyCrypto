<template>
    <div>
        <div class="row">
            <div class="col-sm-3">
              <div class="panel panel-default">
                <div class="panel-heading">Add crypto</div>
                <div class="panel-body">
                  <div class="form-group">
                    <select class="form-control" name="" v-model="name">
                      <option v-for="crypto in availableCryptos" :value="crypto"> {{ crypto }}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <input type="text" class="form-control" v-model="quantity">
                  </div>
                  <button class="btn btn-primary" @click="addItem">Add crypto!</button>
              </div>
              </div>
            </div>

            <div class="col-sm-9">
              <div class="panel panel-default">
                <div class="panel-heading">Current status</div>
                <div class="panel-body">
                <h1 v-if="loading">Loading...
                        <i class="fa fa-spinner fa-spin" style="font-size:24px"></i>
                </h1>
                <div v-else>
                      <h2>
                        <button style="margin-bottom:8px" class="btn btn-primary" @click="loadCryptoData"><i class="fas fa-sync-alt"></i></button>

                        Total: ${{ total | toFixed }}</h2>
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>Cryptocurrency name</th>
                        <th>Quantity</th>
                        <th>Value</th>
                        <th>Current price</th>
                        <th>Decr.</th>
                        <th>Incr.</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in userPortfolio">
                        <td class="col-xs-3">{{ item.name }}</td>
                        <td class="col-xs-2">
                          <span v-show="!item.editable" @click="toggle(item, $event)">{{ item.quantity }}</span>
                          <input type="text" class="edit" :id="item.name" v-show="item.editable" @blur="saveInfo(item)" :value="item.quantity">
                        </td>
                        <td class="col-xs-2">${{ item.value | toFixed }}</td>
                        <td  class="col-xs-2">${{ item.price | toFixed}}</td>
                        <td class="col-xs-1">
                          <button class="btn btn-default" @click="updateItem(item, -1, false)"  type="button"><i class="fas fa-minus"></i></button>
                        </td>
                        <td class="col-xs-1">
                          <button class="btn btn-default" @click="updateItem(item, 1, false)"  type="button"><i class="fas fa-plus"></i></button>
                        </td>
                        <td  class="col-xs-1"><button class="btn btn-default" @click.prevent="deleteItem(item.key)"><i class="fas fa-trash-alt"></i></button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                </div>
              </div>

            </div>

        </div>
        <br>
    </div>
</template>
<script>
import addForm from "./addForm";

export default {
  data() {
    return {
      focused: false,
      total: 0,
      name: "",
      quantity: 0,
    };
  },

  computed: {
    loggedUser() {
      return this.$store.state.loggedUser;
    },
    userPortfolio() {
      return this.$store.state.loggedUser.portfolio;
    },
    availableCryptos() {
      return this.$store.state.availableCryptos;
    },
    loading() {
      return this.$store.getters.loading;
    }
  },
  watch: {
    total: function(val) {
      this.$store.commit("setTotal", val);
    }
  },
  methods: {
    toggle: function(item) {
      item.editable = !item.editable;
      this.$nextTick(function() {
        document.getElementById(item.name).focus();
      });
    },
    saveInfo: function(item) {
      let value = document.getElementById(item.name).value;
      this.updateItem(item, value, true);
      item.editable = !item.editable;
    },
    addItem: function(data) {
      this.loading = true;
      // this.$store.commit("setLoading", true);
      this.$store
        .dispatch("addItem", {
          name: this.name,
          quantity: this.quantity
        })
        .then(() => {
          this.loadCryptoData();
        });
    },
    updateItem: function(data, value, newValue) {
      this.loading = true;
      // this.$store.commit("setLoading", true);

      this.$store
        .dispatch("updateItem", {
          name: data.name,
          quantity: value,
          newValue: newValue
        })
        .then(() => {
          this.loadCryptoData();
        });
    },
    deleteItem: function(itemId) {
      let objKey = { key: itemId };
      this.$store.dispatch("deleteItem", objKey).then(() => {
        this.loadCryptoData();
      });
    },
    getCryptoInfo: function(item, index) {
      let context = this;
      return new Promise((res, rej) => {
        let url = "https://api.coinmarketcap.com/v1/ticker/" + item.name + "/";
        this.$http
          .get(url)
          .then(response => {
            return response.body;
          })
          .then(data => {
            let cryptoInfo = data[0];
            let obj = {
              index: index,
              price: +cryptoInfo.price_usd,
              value: cryptoInfo.price_usd * item.quantity
            };
            res(obj);
          })
          .catch(error => {
            console.log("Request failed :(");
          });
      });
    },
    loadCryptoData: function() {
      this.total = 0;

      let promises = [];
      this.$store.getters.user.portfolio.forEach((item, index) => {
        promises.push(this.getCryptoInfo(item, index));
      });

      let context = this;
      Promise.all(promises).then(function(dataArr) {
        context.loading = false;
        // context.$store.commit("setLoading", false);

        dataArr.forEach(function(data) {
          context.total += data.value;
          context.$store.dispatch("loadCryptoInformation", data);
        });
      });
    }
  },

  created() {
    this.loadCryptoData();
  }
};
</script>
<style scoped>
.refresh {
  margin-top: 20px;
}
.table td,
th {
  text-align: center;
}
th {
  padding-bottom: 20px !important;
}
.count {
  text-align: center;
}
.edit {
  width: 60px;
  text-align: center;
}
</style>
