<template>
        <div class="row">
        <div class="col-sm-3">
            <div class="panel panel-default">
                <div class="panel-heading">User info</div>
                    <div class="panel-body">
                        <p><strong>Username:</strong> {{ currentUser }}</p>
                        <p><strong>Total value:</strong>
                        <span v-if="total">{{ total }}</span>
                        <i v-else class="fa fa-spinner fa-spin" style="font-size:24px"></i>
                        </p> 
                        <p><strong>Available cryptos</strong></p>
                        <ul class="list-group">
                            <li class="list-group-item" v-for="crypto in cryptos">{{ crypto }}</li>
                        </ul>
                        {{ info.totalMarketCap }}
                    </div>
            </div>
        </div>
        <div class="col-sm-9">
            <div class="panel panel-default">
                <div class="panel-heading">Current status</div>
                    <div class="panel-body">
                          <h1>Welcome to our page {{ currentUser }}</h1>
                          <div class="btcwdgt-chart"></div>
                    </div>
            </div>
        </div>
        </div>
</template>
<script>
export default {
  data() {
      return {
          info: {}
      }
  },
  computed: {
    currentUser() {
      return this.$store.getters.user.fullname;
    }, 
    cryptos() {
        let userCryptos = [];
        this.$store.getters.user.portfolio.forEach((item) => {
            userCryptos.push(item.name)
        });
        return userCryptos;
    },
    total() {
      return this.$store.getters.total;
    }, 
  },
  methods: {
    getGlobalData: function() {
      let context = this;
      return new Promise((res, rej) => {
        let url = "https://api.coinmarketcap.com/v1/global/";
        this.$http
          .get(url)
          .then(response => {
            return response.body;
          })
          .then(data => {
            let obj = {
              totalMarketCap: data.total_market_cap_usd,
              total24Volume: data.total_24h_volume_usd,
              btcPercentage: data.bitcoin_percentage_of_market_cap,
              activeCurrencies: data.active_currencies,
              activeAssets: data.active_assets,
              activeMarkets: data.active_markets,
            };
            res(obj);
          })
          .catch(error => {
            console.log("Request failed :(");
          });
      });
    }
  },
  created() {
    this.getGlobalData().then((data) => {
        this.info = data;
    });
  },
};
</script>
