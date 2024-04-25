<template>
  <nav>
    <ul class="pagination pagination-md">
      <li
        class="page-item"
        :class="{ disabled: !wordsListPrevious }"
        @click="updatePaginator(wordsListPrevious)"
      >
        <button
          class="page-link"
        >
          <span aria-hidden="true">&laquo;</span>
        </button>
      </li>
      <li class="mx-2"></li>
      <li class="page-item" :class="{ disabled: !wordsListNext }">
        <button
          class="page-link"
          @click="updatePaginator(wordsListNext)"
        >
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>
    </ul>
  </nav>

</template>

<script>


import { mapGetters } from "vuex"

export default {
  name: "PaginatorView",
  data() {
    return {
      BACKEND_PROTOCOL: process.env.VUE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: process.env.VUE_APP_BACKEND_HOST,
      BACKEND_PORT: process.env.VUE_APP_BACKEND_PORT
    }
  },
  props: {
    wordsListPrevious: { type: [String, null] },
    wordsListNext: { type: [String, null] },
    updatePaginator: { type: Function, required: true }
  },
  async created() {

  },

  methods: {},
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken"
    })

  },
  watch: {}
}
</script>

<style scoped></style>
