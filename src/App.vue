<template>
  <div>
    <NavbarView />
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import NavbarView from "@/components/common/NavbarView.vue"

export default {
  components: { NavbarView},
  methods: {
    logOut() {
      this.$store.dispatch("auth/actionRemoveLogIn")
      this.$router.push({ name: "login", replace: true })
    }
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
      isLoggedIn: "auth/getIsLoggedIn"
    })
  }
}
</script>
<style></style>
