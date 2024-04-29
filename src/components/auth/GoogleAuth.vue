<template>

</template>

<script>
import { mapGetters } from "vuex"
import axios from "axios"

export default {
  name: "GoogleAuth",
  data() {
    return {
      REDIRECT_URL: process.env.VUE_APP_GOOGLE_REDIRECT_URL,
      GOOGLE_CLIENT_ID: process.env.VUE_APP_GOOGLE_OAUTH2_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.VUE_APP_GOOGLE_OAUTH2_SECRET
    }
  },

  async created() {
    // console.log("code", this.$route.query.code)
    // console.log("code", this.$route.query)

    const params = new URLSearchParams()
    params.append("code", this.$route.query.code)
    params.append("client_id", this.GOOGLE_CLIENT_ID)
    params.append("client_secret", this.GOOGLE_CLIENT_SECRET)
    params.append("redirect_uri", this.REDIRECT_URL)
    params.append("access_type", "offline")
    params.append("grant_type", "authorization_code")
    // console.log(params.toString())
    const response = await axios.post("https://oauth2.googleapis.com/token", params)

    this.$store
      .dispatch("auth/actionGoogleLogIn", response.data.access_token)
      .then(() => {
        this.$router.replace(this.$route.query.redirect || "/")
      })


    // console.log('response from google', response.data)


    // console.log("kk", decodeURIComponent(this.$route.query.code))
    // await axios.get("http://localhost:8000/api/auth/google/", { headers: { "access_token": this.$route.query.code} })
  },
  methods: {
    async googleLogin() {

    }
  }
}
</script>

<style scoped>

</style>
