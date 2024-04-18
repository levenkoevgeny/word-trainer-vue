<template>


  <div class="container">
    Spelling
  </div>


</template>

<script>
import { mapGetters } from "vuex"
import { dictionariesAPI } from "@/api/client/dictionariesAPI"

import debounce from "lodash.debounce"

export default {
  name: "SpellingTrainingView",
  data() {
    return {
      wordsList: { results: [] },
      currentDictionary: {},

      isLoading: true,
      isError: false,
      BACKEND_PROTOCOL: process.env.VUE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: process.env.VUE_APP_BACKEND_HOST,
      BACKEND_PORT: process.env.VUE_APP_BACKEND_PORT
    }
  },
  async created() {
    this.isLoading = true
    this.isError = false
    try {
      await this.loadData()
    } catch (e) {
      this.isError = true
    } finally {
      this.isLoading = false
    }
  },

  methods: {},
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken"
    }),

  },
  watch: {}
}
</script>

<style scoped></style>
