<template>

</template>

<script>
import { mapGetters } from "vuex"
import axios from "axios"

export default {
  name: "GoogleAuth",
  data() {
    return {}
  },

  async created() {
    console.log(this.$route.query.code)
    console.log("kk", decodeURIComponent(this.$route.query.code))
    await axios.get("http://localhost:8000/api/auth/google/", { headers: { "access_token": this.$route.query.code} })
  },
  methods: {
    async googleLogin() {

    }
  }
}
</script>

<style scoped>

</style>
