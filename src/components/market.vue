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
                <h1 v-if="loading">Loading...</h1>
                <div v-else>
                      <h2>Total: ${{ total | toFixed }}</h2>
                      <button class="btn btn-primary" @click="loadCryptoData">Refresh</button>
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>Cryptocurrency name</th>
                        <th>Quantity</th>
                        <th>Value</th>
                        <th>Current price</th>
                        <th>Remove from portfolio</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in userPortfolio">
                        <td>{{ item.name }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ item.value }}</td>
                        <td>{{ item.price }}</td>
                        <td><button class="btn btn-danger" @click.prevent="deleteItem(item.key)">Remove</button></td>
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
export default {
  data() {
    return {
      info: "INFOOOO",
      name: "",
      quantity: 0,
      total: 0,
      loading: true
    };
  },
  computed: {
    // totalFixed() {
    //   return this.total.toFixed(2);
    // },
    loggedUser() {
      return this.$store.state.loggedUser;
    },
    userPortfolio() {
      return this.$store.state.loggedUser.portfolio;
    },
    availableCryptos() {
      return this.$store.state.availableCryptos;
    }
  },
  watch: {
    total: function(val) {
      this.$store.commit("setTotal", val);
    }
  },
  methods: {
    addItem: function(data) {
      this.loading = true;
      this.$store
        .dispatch("addItem", {
          name: this.name,
          quantity: this.quantity
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
      let result = [];
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
              price: cryptoInfo.price_usd,
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
        dataArr.forEach(function(data) {
          context.total += data.value;
          context.$store.dispatch("loadCryptoInformation", data);
        });
      });
    }
  },

  created() {
    this.loadCryptoData();
  },
};
</script>
<style scoped>
.refresh {
  margin-top:20px;
}

</style>
