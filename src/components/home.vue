<template>
  <h1>Welcome to our page {{ currentUser }}</h1>
</template>
<script>
export default {
  computed: {
      currentUser() {
          if(this.$store.state.loggedUser) {
          console.log(this.$store.state.loggedUser.fullname)
                return this.$store.state.loggedUser.fullname
            }
            return "Guest"
      }
  },
  created() {
      console.log(this.$store.state.loggedUser)
  }
}
</script>
