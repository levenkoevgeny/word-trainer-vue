<template>
  <!--  <div v-if="isLoading" class="fs-4">...Loading</div>-->

  <div
    class="modal fade"
    id="updateWordModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="wordUpdate"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form @submit.prevent="updateWord">
          <div class="modal-header">
            <h5 class="modal-title">Редактирование</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-4">
                  <div class="mb-3">
                    <label class="form-label">Foreign word</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="currentWordForUpdate.word_eng"
                      required
                    />
                  </div>
                </div>
                <div class="col-4">
                  <div class="mb-3">
                    <label class="form-label">Native word</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="currentWordForUpdate.word_rus"
                      required
                    />
                  </div>
                </div>
                <div class="col-4">
                  <div class="mb-3">
                    <label class="form-label">Dictionary</label>
                    <select
                      class="form-select"
                      v-model="currentWordForUpdate.dictionary"
                      required
                    >
                      <option selected value="">--------</option>
                      <option
                        v-for="dictionary in orderedDictionaries"
                        :key="dictionary.id"
                        :value="dictionary.id"
                      >
                        {{ dictionary.dictionary_name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              ref="updateWordModalCloseButton"
            >
              Close
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div>
    <div>
      <div class="d-flex align-items-end" :class="{ 'd-none': isInputForDictUpdateVisible }">
        <h3 class="fst-italic fs-1">{{ currentDictionary.dictionary_name }}
          <span class="fs-5"><a href="#" @click="showInputForDictNameUpdate"><font-awesome-icon
            :icon="['fas', 'pen-to-square']" /></a></span>
        </h3>
      </div>
      <div class="mb-3 mt-2" :class="{ 'd-none': !isInputForDictUpdateVisible }">
        <input type="text"
               class="form-control"
               v-model="currentDictionary.dictionary_name"
               @keyup.enter="showInputForDictNameUpdate"
        >
        <div class="form-text">Press Enter after editing</div>
      </div>


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
          <button type="button" class="btn btn-dark pb-2" style="width: 100%;height: 100%" @click="addNewWord"
                  :disabled="isNewWordValidated">
            <span class="fw-light"><font-awesome-icon :icon="['fas', 'plus']" /></span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="fs-5 mt-3">...Loading</div>
    <div class="mt-3" v-else>
      <PaginatorView :update-paginator="updatePaginator" :words-list-previous="wordsList.previous"
                     :words-list-next="wordsList.next" v-if="wordsList.previous || wordsList.next" />
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
          <td class="text-danger" v-if="checkedForDeleteCount > 0">
            <span class="d-flex flex-nowrap align-items-center">
              <font-awesome-icon
                :icon="['fas', 'trash-can']"
                class="text-danger"
                @click="deleteCheckedWordsHandler" />
              <span class="fw-bolder">&nbsp;({{ checkedForDeleteCount }})</span>
            </span>
          </td>
          <td v-else></td>
        </tr>
        <tr v-for="word in orderedWords" :key="word.id" style="cursor: pointer" @dblclick="showModalForUpdate(word.id)">
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
      <PaginatorView :update-paginator="updatePaginator" :words-list-previous="wordsList.previous"
                     :words-list-next="wordsList.next" v-if="wordsList.previous || wordsList.next" />
    </div>
  </div>


</template>

<script>
import { mapGetters } from "vuex"
import { wordsAPI } from "@/api/client/wordsAPI"
import { dictionariesAPI } from "@/api/client/dictionariesAPI"

import Spinner from "@/components/common/Spinner"
import PaginatorView from "@/components/client/PaginatorView.vue"

import debounce from "lodash.debounce"

import {
  getCurrentFormatDate,
  getFormattedDate,
  getFormattedTime
} from "@/utils"

export default {
  name: "WordsView",
  components: { Spinner, PaginatorView },

  data() {
    return {
      wordsList: { results: [], previous: null, next: null },
      dictionariesList: { results: [] },
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
      },
      isInputForDictUpdateVisible: false,
      currentWordForUpdate: {
        word_rus: "",
        word_eng: "",
        dictionary: ""
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
        const currentDictionaryResponse = await dictionariesAPI.getItemData(
          this.userToken, this.searchForm.dictionary
        )
        this.currentDictionary = await currentDictionaryResponse.data

        const dictionariesResponse = await dictionariesAPI.getItemsList(
          this.userToken
        )
        this.dictionariesList = await dictionariesResponse.data

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
    async updateWord() {
      try {
        await wordsAPI.updateItem(this.userToken, this.currentWordForUpdate)
        await this.loadData()
        this.$refs.updateWordModalCloseButton.click()
      } catch (e) {
        this.isError = true
      } finally {
      }
    },
    async showModalForUpdate(wordId) {
      this.isError = false
      try {
        const response = await wordsAPI.getItemData(this.userToken, wordId)
        this.currentWordForUpdate = await response.data
        let updateModal = this.$refs.wordUpdate
        let myModal = new bootstrap.Modal(updateModal, {
          keyboard: false
        })
        myModal.show()
      } catch (error) {
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
    deleteCheckedWordsHandler() {
      this.isLoading = true
      this.isError = false
      let requestIds = []
      this.wordsList.results.map((word) => {
        if (word.checked_val) {
          requestIds.push(word.id)
        }
        return
      })
      let requests = requestIds.map((id) =>
        wordsAPI.deleteItem(this.userToken, id)
      )
      Promise.all(requests)
        .then(async () => {
          await this.loadData()
        })
        .catch(() => (this.isError = true))
        .finally(() => {
          this.isLoading = false
        })
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
    async updatePaginator(url) {
      this.isLoading = true
      try {
        const response = await wordsAPI.updateList(url, this.userToken)
        this.wordsList = await response.data
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    showInputForDictNameUpdate() {
      this.isInputForDictUpdateVisible = !this.isInputForDictUpdateVisible
    },
    debouncedSearch: debounce(async function() {
      await this.loadData()
    }, 500),
    debouncedDictNameUpdate: debounce(async function() {
      try {
        await dictionariesAPI.updateItem(this.userToken, this.currentDictionary)
      } catch (error){
        this.isError = true
      } finally {}
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
    },
    orderedDictionaries() {
      return this.dictionariesList.results
    },
    checkedForDeleteCount() {
      let counter = 0
      this.wordsList.results.map((word) => {
        if (word.checked_val) {
          counter++
        }
      })
      return counter
    },
    isNewWordValidated() {
      return this.searchForm.word_rus === "" || this.searchForm.word_eng === ""
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
      },
      "currentDictionary.dictionary_name": {
        handler() {
          this.debouncedDictNameUpdate()
          // this.debouncedSearch()

        }
      }
    }
}
</script>

<style scoped></style>
