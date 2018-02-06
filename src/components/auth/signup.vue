<template>
<div class="row">
    <h1 class="text-center">Sign Up</h1><br>
  <div class="col-sm-6 col-sm-offset-3 text-center">
      <label for="email">E-mail
      <input type="email" class='form-control' name="email" v-model="email" required>
      </label><br>
      <label for="fullname">Full name
      <input type="text" class='form-control' name="fullname" v-model="fullname" required>
      </label><br>
      <label for="password">Password
      <input type="password" class='form-control' name="password" v-model="password" required>
      </label><br>
      <button class="btn btn-primary" @click="register">Sign Up</button>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      fullname: "",
    };
  },
  methods: {
    register: function() {
      this.$store.dispatch("signup", {
        email: this.email,
        password: this.password,
        fullname: this.fullname,
      });
      // this.$router.push({ name: 'home'})
    },
    doTest: function() {
      console.log(this.$store.getters.test);
    }
  }
};
</script>
