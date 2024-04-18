<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3 pt-3">
        <div>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" placeholder="name" v-model="searchForm.dictionary_name" @keyup.enter="addNewDictionary">
            <label for="floatingInput" class="fw-light">Dictionary name</label>
          </div>
          <table class="table table-borderless table-hover">
            <tbody>
            <tr v-for="dict in orderedDictionaries" :key="dict.id"
                style="cursor: pointer">
              <td class="fs-6" @click="navigateToDict(dict.id)"> {{ dict.dictionary_name }}</td>
              <td class="fs-6">
                <font-awesome-icon :icon="['fas', 'person-running']" @click="navigateToSpeedTraining(dict.id)" title="Speed running"/>&nbsp;&nbsp;&nbsp;&nbsp;
<!--                <font-awesome-icon :icon="['fas', 'pen-to-square']" @click="navigateToSpellingTraining(dict.id)" />&nbsp;&nbsp;&nbsp;&nbsp;-->
                <font-awesome-icon :icon="['fas', 'trash-can']" @click="deleteDictionary(dict.id)" title="Delete dictionary" />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-md-9 bg-light pt-3" style="min-height: 92vh">
        <div>
          <router-view></router-view>
        </div>
      </div>


    </div>

  </div>


</template>

<script>
import { mapGetters } from "vuex"
import { dictionariesAPI } from "@/api/client/dictionariesAPI"


import Spinner from "@/components/common/Spinner"
import debounce from "lodash.debounce"

import {
  getFormattedDate,
  getFormattedTime
} from "@/utils"

export default {
  name: "ClientMainView",
  components: { Spinner },
  data() {
    return {
      dictionariesList: { results: [] },
      searchForm:{
        dictionary_name: "",
      },
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

  methods: {
    async loadData() {
      const dictResponse = await dictionariesAPI.getItemsList(
        this.userToken, this.searchForm
      )
      this.dictionariesList = await dictResponse.data
    },

    async deleteDictionary(dict_id) {
      try {
        await dictionariesAPI.deleteItem(this.userToken, dict_id)
        await this.loadData()
        window.location.href = '/dictionaries'
      } catch (e) {
        this.isError = true
      } finally {
      }
    },
    async addNewDictionary(){
      try {
        const newDictResponse = await dictionariesAPI.addItem(this.userToken, {...this.searchForm, owner: this.userData.id})
        const newDict = await newDictResponse.data
        await this.loadData()
        this.$router.push({name: 'words' , params: { id: newDict.id }})
      } catch (e) {
        this.isError = true
      } finally {
      }
    },

    navigateToDict(dict_id) {
      this.$router.push({ name: "words", params: { id: dict_id } })
    },
    navigateToSpeedTraining(dict_id) {
      this.$router.push({ name: "speed", params: { id: dict_id } })
    },
    navigateToSpellingTraining(dict_id) {
      this.$router.push({ name: "spelling", params: { id: dict_id } })
    },

    debouncedSearch: debounce(async function() {
      await this.loadData()
    }, 100),
    getFormattedDateComponent(dateTime) {
      return getFormattedDate(dateTime)
    },
    getFormattedTimeComponent(dateTime) {
      return getFormattedTime(dateTime)
    }

  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken"
    }),
    orderedDictionaries() {
      return this.dictionariesList.results
    }
  },
  watch: {
    searchForm: {
      handler() {
        this.debouncedSearch()
      },
      deep: true
    }
  }
}
</script>

<style scoped></style>
