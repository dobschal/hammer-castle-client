import Vue from "vue";
import App from "./App.vue";
import axiosPlugin from "./plugins/axios";
import websocketPlugin from "./plugins/websocket";
import utilPlugin from "./plugins/util";
import Vuex from "vuex";
import store from "./store";
import VTooltip from "v-tooltip";
import VueI18n from "vue-i18n";
import landDe from "./lang/de";
import landEn from "./lang/en";

Vue.config.productionTip = false;

Vue.use(VTooltip);
Vue.use(Vuex);
Vue.use(axiosPlugin);
Vue.use(websocketPlugin);
Vue.use(utilPlugin);
Vue.use(VueI18n);

let locale = "en";
try {
  const language = (window.navigator.userLanguage || window.navigator.language).substring(0, 2).toLowerCase();
  if (["en", "de"].includes(language)) {
    locale = language;
  }
} catch (e) {
  console.error("[main] Error on getting browser language: ", e);
}
const i18n = new VueI18n({
  locale,
  messages: {
    de: landDe,
    en: landEn
  }
});

new Vue({
  render: h => h(App),
  store: new Vuex.Store(store),
  i18n
}).$mount("#app");
