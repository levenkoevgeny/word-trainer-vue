<template>


  <!--  <div v-if="isLoading" class="fs-4">...Loading</div>-->

  <div>
    <div>
      <h3 class="fst-italic fs-1">{{ currentDictionary.dictionary_name }}</h3>
      <p class="fs-4"><span class="fs-3">{{ wordsList.count }}</span> - слов (а)</p>
    </div>

    <div class="row">
      <div class="col-lg-4">
        <div class="form-floating">
          <input type="text" class="form-control" placeholder="Word foreign" v-model="searchForm.word_eng">
          <label for="floatingPassword" class="fw-light">Foreign word</label>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="form-floating">
          <input type="text" class="form-control" placeholder="Word native" v-model="searchForm.word_rus">
          <label for="floatingInput" class="fw-light">Native word</label>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="" style="width: 100%;height: 100%">
          <button type="button" class="btn btn-dark pb-2" style="width: 100%;height: 100%" @click="addNewWord">
            <span class="fw-light"><font-awesome-icon :icon="['fas', 'plus']" /></span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="fs-5 mt-3">...Loading</div>
    <div class="mt-3" v-else>
      <table class="table table-hover fw-light">
        <tbody>
        <tr v-if="wordsList.results.length">
          <td colspan="3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                     @click="checkAllHandler($event)">
              <label class="form-check-label">
                Check all
              </label>
            </div>
          </td>
          <td></td>
        </tr>
        <tr v-for="word in orderedWords" :key="word.id" style="cursor: pointer" @dblclick="console.log('click')">
          <td style="width: 30px;">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" v-model="word.checked_val" @click.stop>
            </div>
          </td>
          <td style="width: 45%">{{ word.word_eng }}</td>
          <td style="width: 45%">{{ word.word_rus }}</td>
          <td @click="deleteWord(word.id)">
            <font-awesome-icon :icon="['fas', 'trash-can']" />
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>


</template>

<script>
import { mapGetters } from "vuex"
import { wordsAPI } from "@/api/client/wordsAPI"
import { dictionariesAPI } from "@/api/client/dictionariesAPI"

import Spinner from "@/components/common/Spinner"
import debounce from "lodash.debounce"

import {
  getCurrentFormatDate,
  getFormattedDate,
  getFormattedTime
} from "@/utils"

export default {
  name: "WordsView",
  components: { Spinner },

  data() {
    return {
      wordsList: { results: [] },
      currentDictionary: {},
      isLoading: true,
      isError: false,
      BACKEND_PROTOCOL: process.env.VUE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: process.env.VUE_APP_BACKEND_HOST,
      BACKEND_PORT: process.env.VUE_APP_BACKEND_PORT,
      searchForm: {
        word_rus: "",
        word_eng: "",
        dictionary: "",
        limit: ""
      }
    }
  },
  async created() {
    this.searchForm.word_rus = ""
    this.searchForm.word_eng = ""

    this.searchForm.dictionary = this.$route.params.id
    this.$watch(
      () => this.$route.params.id,
      async (newId, oldId) => {
        this.searchForm.dictionary = newId
        await this.loadData()
        this.searchForm.word_rus = ""
        this.searchForm.word_eng = ""
      }
    )
    await this.loadData()
  },

  methods: {
    async loadData() {
      this.isLoading = true
      this.isError = false
      try {
        const dictionaryResponse = await dictionariesAPI.getItemData(
          this.userToken, this.searchForm.dictionary
        )
        this.currentDictionary = await dictionaryResponse.data

        const wordsResponse = await wordsAPI.getItemsList(
          this.userToken, this.searchForm
        )
        this.wordsList = await wordsResponse.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async addNewWord() {
      try {
        await wordsAPI.addItem(this.userToken, this.searchForm)
        await this.loadData()
      } catch (e) {
        this.isError = true
      } finally {
      }
    },

    async deleteWord(word_id) {
      try {
        await wordsAPI.deleteItem(this.userToken, word_id)
        await this.loadData()
      } catch (e) {
        this.isError = true
      } finally {
      }
    },

    checkAllHandler(e) {
      if (e.target.checked) {
        this.wordsList.results = this.wordsList.results.map(
          (serReq) => ({
            ...serReq,
            checked_val: true
          })
        )
      } else {
        this.wordsList.results = this.wordsList.results.map(
          (serReq) => ({
            ...serReq,
            checked_val: false
          })
        )
      }
    },

    debouncedSearch: debounce(async function() {
      await this.loadData()
    }, 500),
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
    orderedWords() {
      return this.wordsList.results
    }
  },
  watch:
    {
      "searchForm.word_rus": {
        handler() {
          this.debouncedSearch()
        }
      },
      "searchForm.word_eng": {
        handler() {
          this.debouncedSearch()
        }
      }
    }
}
</script>

<style scoped></style>
