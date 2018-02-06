<template>
        <div class="row">
        <div class="col-sm-3">
            <div class="panel panel-default">
                <div class="panel-heading">Current status</div>
                    <div class="panel-body">
                        Lorem ipsum dolor sit amet.
                    </div>
            </div>
        </div>
        <div class="col-sm-9">
            <div class="panel panel-default">
                <div class="panel-heading">Current status</div>
                    <div class="panel-body">
                          <h1>Welcome to our page {{ currentUser }}</h1>
                    </div>
            </div>
        </div>
        </div>
</template>
<script>
export default {
  computed: {
    currentUser() {
      if (this.$store.state.loggedUser) {
        console.log(this.$store.state.loggedUser.fullname);
        return this.$store.state.loggedUser.fullname;
      }
      return "Guest";
    }
  },
  ready() {
    let scriptEl = document.createElement("script");
    scriptEl.setAttribute("src", "https://s3.tradingview.com/tv.js");
    document.getElementById("chart").appendChild(scriptEl);
    // new TradingView.widget({
    //     "autosize": true,
    //     "symbol": "BITFINEX:BTCUSD",
    //     "interval": "D",
    //     "timezone": "Etc/UTC",
    //     "theme": "Light",
    //     "style": "1",
    //     "locale": "en",
    //     "toolbar_bg": "#f1f3f6",
    //     "enable_publishing": false,
    //     "allow_symbol_change": true,
    //     "hideideas": true
    // });
  }
};
</script>
