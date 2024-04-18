<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand fst-italic fs-4" href="/">Dictionary trainer</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { Navbar } from "@/components/common"
export default {
  components: { Navbar },
}
</script>
<style></style>
