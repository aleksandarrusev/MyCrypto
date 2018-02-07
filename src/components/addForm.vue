<template>
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
            <input type="number" class="form-control" v-model="quantity" required>
            </div>
            <button class="btn btn-primary" :disabled="quantity < 1" @click="addItem">Add crypto!</button>
        </div>
        </div>
    </div>

</template>
<script>
export default {
  data() {
    return {
      name: "",
      quantity: 0
    };
  },
  props: ["loadCryptoData"],
  computed: {
    loggedUser() {
      return this.$store.getters.user;
    },
    availableCryptos() {
      return this.$store.state.availableCryptos;
    }
  },
  methods: {
    addItem: function(data) {
      if(this.quantity > 0) {
      this.$store.commit("setLoading", true);
        this.$store
          .dispatch("addItem", {
            name: this.name,
            quantity: this.quantity
          })
          .then(() => {
            this.loadCryptoData();
          });
      }
    },  }
};
</script>
<style>

</style>
