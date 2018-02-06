<template>
<div class="row">
    <h1 class="text-center">Sign In</h1><br>
  <div class="col-sm-6 col-xs-offset-3 text-center">
      <label for="email">E-mail
      <input type="text" class='form-control' name="email" v-model="email" required>
      </label><br>
      <label for="password">Password
      <input type="password" class='form-control' name="password" v-model="password" required>
      </label><br>
      <button @click="signIn" class="btn btn-primary">Sign In</button>
       <!-- <button @click="doTest" class="btn btn-primary">Check</button> -->

  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  computed: {
    user: function() {
      return this.$store.state.loggedUser;
    }
  },
  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        this.$router.push("/");
      }
    }
  },
  methods: {
    signIn: function() {
      this.$store.dispatch("signIn", {
        email: this.email,
        password: this.password
      });
    },
    doTest: function() {
      console.log(this.$store.getters.test);
    }
  }
};
</script>
