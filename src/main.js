import Vue from "vue";
import App from "./App.vue";
import axiosPlugin from "./plugins/axios";
import websocketPlugin from "./plugins/websocket";
import utilPlugin from "./plugins/util";
import Vuex from "vuex";
import store from "./store";

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(axiosPlugin);
Vue.use(websocketPlugin);
Vue.use(utilPlugin);

new Vue({
  render: h => h(App),
  store: new Vuex.Store(store)
}).$mount("#app");
