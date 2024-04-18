import axios from "axios"
import { authHeaders } from "@/api/auth/authAPI"

let base_url = "outgo-data"

export const outgoDataAPI = {
  async getItemsList(token, searchForm = { outgo_date: "", kind: "" }) {
    let { outgo_date, kind } = { ...searchForm }
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/?outgo_date=${outgo_date}&kind=${kind}&limit=1000`,
      authHeaders(token),
    )
  },
  async getItemData(token, itemId) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/${itemId}`,
      authHeaders(token),
    )
  },
}
