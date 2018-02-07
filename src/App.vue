<template>
  <div id="app" class="container">
    <div class="loading" v-if="loading">

    </div>
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from "./components/header";
export default {
  components: {
    "app-header": Header
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    }
  }
};
</script>

<style>

.loading {
  width:100%;
  height:100%;
  z-index:1;
  position:fixed;
  top: 0;
  left:0;
  background-color:rgba(0, 0, 0, 0.1)
}


</style>
