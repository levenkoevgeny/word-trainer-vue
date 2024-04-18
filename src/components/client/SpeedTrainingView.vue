<template>

  <div class="container">
    <h1 class="my-3" style="font-size: 60px" v-if="currentDictionary">{{ currentDictionary.dictionary_name }}</h1>
    <div class="d-flex justify-content-center">
      <p class="fs-2">Interval speed - <span class="ds-1 fw-bold">{{ intervalSpeed }}x</span></p>
    </div>
    <div class="d-flex flex-row align-items-center my-3">
      <span class="me-2 fs-3">{{ minIntervalSpeed }}x</span>
      <input type="range" class="form-range" :min="minIntervalSpeed" :max="maxIntervalSpeed" v-model="intervalSpeed">
      <span class="ms-2 fs-3">{{ maxIntervalSpeed }}x</span>
    </div>
    <div class="d-flex align-items-center justify-content-center" v-if="wordsList.results.length > 0"
         style="font-size: 30px;">

      <button v-if="!isTrainRunning" type="button" class="btn btn-light btn-lg" @click="startTrain" style="padding: 1rem 3rem; font-size: 3rem">
        <font-awesome-icon icon="fa-solid fa-play" />
      </button>

      <button v-if="isTrainRunning" type="button" class="btn btn-light btn-lg" @click="stopTrain" style="padding: 1rem 3rem; font-size: 3rem">
        <font-awesome-icon :icon="['fas', 'pause']" />
      </button>
    </div>
    <div class="d-flex align-items-center justify-content-center" v-if="wordsList.results.length <= 0">
      <h1>Словарь пустой</h1>
    </div>

    <div class="my-4">
      <h1 v-if="randomWord" class="text-center" style="width: 100%; font-size: 70px;">{{ randomWord.word_rus }}</h1>
      <h1 v-if="randomWord" class="text-center alert alert-success" ref="answer" style="width: 100%; font-size: 10px;">
        {{ randomWord.word_eng }}</h1>
    </div>
  </div>


</template>

<script>
import { mapGetters } from "vuex"
import { dictionariesAPI } from "@/api/client/dictionariesAPI"

import { wordsAPI } from "@/api/client/wordsAPI"

export default {
  name: "SpeedTrainingView",
  data() {
    return {
      wordsList: { results: [] },
      currentDictionary: {},
      randomWord: null,
      isLoading: true,
      isError: false,
      intervalSpeed: 7,
      minIntervalSpeed: 1,
      maxIntervalSpeed: 10,
      intervalId: null,
      searchForm: {
        word_rus: "",
        word_eng: "",
        dictionary: "",
        limit: 10000000
      },
      isTrainRunning: false,
      BACKEND_PROTOCOL: process.env.VUE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: process.env.VUE_APP_BACKEND_HOST,
      BACKEND_PORT: process.env.VUE_APP_BACKEND_PORT
    }
  },
  async created() {

    this.searchForm.dictionary = this.$route.params.id
    await this.loadData()

    this.$watch(
      () => this.$route.params.id,
      async (newId, oldId) => {
        this.searchForm.dictionary = newId
        await this.loadData()
      }
    )
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
    getRandomWord() {
      let randomIndex = Math.floor(Math.random() * this.wordsList.results.length)
      this.randomWord = this.wordsList.results[randomIndex]
    },
    startTrain() {
      this.isTrainRunning = true
      clearInterval(this.intervalId)
      this.intervalId = setInterval(() => this.getRandomWord(), (this.maxIntervalSpeed) * 1000 - this.intervalSpeed * 1000)
    },
    stopTrain() {
      this.isTrainRunning = false
      clearInterval(this.intervalId)
    }
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken"
    })

  },
  watch: {
    intervalSpeed(newInterval, oldInterval) {
      if (this.isTrainRunning) {
        clearInterval(this.intervalId)
        this.intervalId = setInterval(() => this.getRandomWord(),
          (this.maxIntervalSpeed + 1) * 1000 - this.intervalSpeed * 1000)
      }
    }
  }
}
</script>

<style scoped></style>
