import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"


import { faDumbbell } from "@fortawesome/free-solid-svg-icons"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { faPersonRunning } from "@fortawesome/free-solid-svg-icons"
// import { faKey } from "@fortawesome/free-solid-svg-icons"
// import { faUserGroup } from "@fortawesome/free-solid-svg-icons"
// import { faCalendarDays } from "@fortawesome/free-regular-svg-icons"

library.add(faDumbbell)
library.add(faPlus)
library.add(faTrashCan)
library.add(faPenToSquare)
library.add(faPersonRunning)


createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(store)
  .use(router)
  .mount("#app")
