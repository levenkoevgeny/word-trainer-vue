<template>
  <div v-if="isLogInError" class="alert alert-danger m-0 p-3" role="alert">
    Ошибка авторизации!
  </div>
  <div
    class="d-flex justify-content-center align-items-center container-fluid"
    style="background-color: #f5f5f5; height: 100vh"
  >
    <main class="form-signin">
      <form @submit="submitHandler">
        <h1 class="h3 mb-3 fw-normal">Please log in</h1>
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            placeholder="name@example.com"
            v-model="auth_data.username"
            required
          />
          <label>Login</label>
        </div>
        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            placeholder="Password"
            v-model="auth_data.password"
            required
          />
          <label>Password</label>
        </div>
        <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
      </form>
      <button class="btn btn-warning mt-3" @click="googleLogin()" style="width: 100%">
        <font-awesome-icon :icon="['fab', 'google']" />
        Sign in with Google
      </button>
      <br />
      <br />

      No account? <a href="/registration">Create one</a>

      <br />
      <br />
      <p class="mt-5 mb-3 text-muted">&copy; Designed by Levenko Evgeny</p>

    </main>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "LoginView",
  data() {
    return {
      auth_data: {
        username: "",
        password: ""
      },
      REDIRECT_URL: process.env.VUE_APP_GOOGLE_REDIRECT_URL,
      GOOGLE_ID: process.env.VUE_APP_GOOGLE_OAUTH2_CLIENT_ID,
      GOOGLE_SECRET: process.env.VUE_APP_GOOGLE_OAUTH2_SECRET,
    }
  },
  computed: {
    ...mapGetters({
      isLogInError: "auth/getIsLogInError"
    })
  },
  methods: {
    submitHandler(e) {
      e.preventDefault()
      e.stopPropagation()
      this.$store
        .dispatch("auth/actionLogIn", { ...this.auth_data })
        .then(() => {
          this.$router.replace(this.$route.query.redirect || "/")
        })
    },
    async googleLogin() {
      window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${this.GOOGLE_ID}&redirect_uri=${this.REDIRECT_URL}&scope=profile email&response_type=code&include_granted_scopes=true&access_type=offline&state=state_parameter_passthrough_value`
    }
  }
}
</script>

<style scoped>
.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}

body-signin {
  height: 100%;
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="text"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
