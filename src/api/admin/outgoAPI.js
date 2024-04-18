import axios from "axios"
import { authHeaders } from "@/api/auth/authAPI"

let base_url = "outgo"

export const outgoAPI = {
  async getItemsList(token, searchForm = { outgo__in: "" }) {
    let { outgo__in } = { ...searchForm }
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/?outgo__in=${outgo__in}&limit=10000`,
      authHeaders(token),
    )
  },
}
