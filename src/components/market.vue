<template>
    <div>
        <div class="row">
            <app-sidebar></app-sidebar>

            <div class="col-sm-9">
              <div class="panel panel-default">
                <div class="panel-heading">{{ loggedUser.fullname }}'s panel</div>
                <div class="panel-body">
                <div class="loading" v-if="loading">
                    <i class="fa fa-spinner fa-spin" style="position:absolute; top:50%; left:50%;font-size:80px"></i>
                </div>
                <div v-else>
                    <h2>
                      <button style="margin-bottom:8px" class="btn btn-primary pull-right" @click="loadCryptoData"><i class="fas fa-sync-alt"></i> Refresh</button>

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
                        <td class="col-xs-2">${{ item.value }}</td>
                        <td  class="col-xs-2">${{ item.price }}</td>
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
import sidebar from "./sidebar";

export default {
  data() {
    return {
      total: 0,
    };
  },
  components: {
    "app-sidebar": sidebar,
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
      item.editable = false;
      let value = document.getElementById(item.name).value;
      this.updateItem(item, value, true);
    },
    addItem: function(data) {
      this.$store.commit("setLoading", true);
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
      this.$store.commit("setLoading", true);

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
        context.$store.commit("setLoading", false);
        console.log(dataArr);
        dataArr.forEach(function(data) {
          // console.log(data.value)
          context.total += data.value;
          context.$store.dispatch("loadCryptoInformation", data);
        });
      });
    }
  },
  beforeCreate() {
    this.$store.commit("setLoading", true);
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
