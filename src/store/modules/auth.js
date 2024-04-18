import { authApi } from "@/api/auth/authAPI"
import { getLocalToken, saveLocalToken, removeLocalToken } from "@/utils"

const state = () => ({
  token: null,
  isLoggedIn: null,
  isLogInError: null,
  isRegistrationError: null,
  user: { is_staff: false },
})

// getters
const getters = {
  getToken(state) {
    return state.token
  },
  getIsLoggedIn(state) {
    return state.isLoggedIn
  },
  getIsLogInError(state) {
    return state.isLogInError
  },
  getIsRegistrationError(state) {
    return state.isRegistrationError
  },
  getUser(state) {
    return state.user
  },
}

// actions
const actions = {
  async actionLogIn({ commit }, payload) {
    try {
      let { username, password } = payload
      const response = await authApi.logInGetToken(username, password)
      const data = await response.data
      const token = data.access
      const refresh = data.refresh
      if (token) {
        saveLocalToken(token)
        commit("setToken", token)
        commit("setLoggedIn", true)
        commit("setIsLogInError", false)
        const response = await authApi.getUserData(token)
        const userData = await response.data
        commit("setUserData", { ...userData })
      }
    } catch (error) {
      if (error.code !== "ERR_NETWORK") {
        commit("setIsLogInError", true)
      }
    }
  },

  async actionRegistration({ commit }, payload) {
    let { username, password } = payload
    try {
      const response = await authApi.registration(username, password)
      if (response.status !== 201) {
        throw new Error("Registration error")
      }
    } catch (error) {
      commit("setIsRegistrationError", true)
    }
  },

  async actionCheckLoggedIn({ state, commit, dispatch }) {
    if (!state.isLoggedIn) {
      let token = state.token
      if (!token) {
        const localToken = getLocalToken()
        if (localToken) {
          commit("setToken", localToken)
          token = localToken
        }
      }
      if (token) {
        try {
          const response = await authApi.getUserData(token)
          const userData = await response.data
          commit("setUserData", { ...userData })
          commit("setLoggedIn", true)
        } catch (error) {
          dispatch("actionRemoveLogIn")
        }
      } else {
        dispatch("actionRemoveLogIn")
      }
    }
  },

  async actionRemoveLogIn({ state, commit }) {
    removeLocalToken()
    commit("setToken", "")
    commit("setLoggedIn", false)
  },
  async updateUserData({ state }) {
    try {
      const response = await authApi.updateUserData(state.token, {
        ...state.user,
      })
      if (response.status !== 200) {
        throw new Error("User update error")
      }
    } catch (error) {
      throw new Error(error)
    }
  },
}

// mutations
const mutations = {
  setLoggedIn(state, payload) {
    state.isLoggedIn = payload
  },
  setToken(state, payload) {
    state.token = payload
  },
  setUserData(state, payload) {
    state.user = payload
  },
  setIsLogInError(state, payload) {
    state.isLogInError = payload
  },
  setIsRegistrationError(state, payload) {
    state.isRegistrationError = payload
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
