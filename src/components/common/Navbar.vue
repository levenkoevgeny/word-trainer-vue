<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="/"
        ><img :src="iconUrl" alt="" width="40" height="40"
      /></a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/"
              >На главную</a
            >
          </li>
          <li class="nav-item" v-if="userData.is_staff">
            <a class="nav-link" href="/admin">Сводная строевая записка</a>
          </li>
          <li class="nav-item" v-if="userData.is_staff">
            <a class="nav-link" href="/admin/general"
              >Сводная строевая записка (без редактирования)</a
            >
          </li>
          <li class="nav-item dropdown" v-if="userData.is_staff">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Администрирование
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <a class="dropdown-item" href="/admin/users">Пользователи</a>
              </li>
              <li>
                <a class="dropdown-item" href="/admin/subdivisions"
                  >Подразделения</a
                >
              </li>
            </ul>
          </li>
        </ul>
        <div>
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" @click="logOut" style="cursor: pointer">
                Выход из системы
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  props: { userData: { type: Object, required: true } },
  methods: {
    logOut() {
      this.$store.dispatch("auth/actionRemoveLogIn")
      this.$router.push({ name: "login", replace: true })
    },
  },
  computed: {
    iconUrl() {
      return require("@/assets/favicon.png")
    },
  },
}
</script>

<style scoped></style>
