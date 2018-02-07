<template>
<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">MyCrypto</a>
    <ul class="nav navbar-nav">
        <router-link to="/" tag="li" active-class="active" exact><a>Marketplace</a> </router-link>
    </ul>
      </div>
      <ul class="nav navbar-nav navbar-right" v-if="!isSignedIn">
        <router-link to="/signup" tag="li" active-class="active" exact><a>Sign Up</a> </router-link>
        <router-link to="/signin" tag="li" active-class="active"><a>Sign In</a></router-link>
      </ul>
      <ul class="nav navbar-nav navbar-right" v-else>
        <li><a href="" @click.prevent="signOut">Sign Out</a></li>
      </ul>
    
        </div>

</nav>

</template>
<script>
export default {
  computed: {
    isSignedIn: function() {
      return this.$store.getters.user;
    }
  },
  methods: {
    signOut: function() {
      this.$store.dispatch('signOut')
    }
  }
};
</script>
<style>

</style>
