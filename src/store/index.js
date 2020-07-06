import { axios } from "../plugins/axios";
import { userActions, userState, userMutations } from "./user";
import { castleActions, castleState, castleMutations } from "./castle";

export default {
  state: {
    progress: 0,
    serverVersion: undefined,
    ...userState,
    ...castleState
  },
  getters: {
    busy(state) {
      return state.progress > 0;
    }
  },
  mutations: {
    PROGRESS(state, counter) {
      state.progress += counter;
    },
    SET_SERVER_VERSION(state, version) {
      state.serverVersion = version;
    },
    ...userMutations,
    ...castleMutations
  },
  actions: {
    async GET_SERVER_VERSION({ commit }) {
      try {
        commit("PROGRESS", 1);
        const {
          data: { version }
        } = await axios.get("/version");
        commit("SET_SERVER_VERSION", version);
      } finally {
        commit("PROGRESS", -1);
      }
    },
    ...userActions,
    ...castleActions
  }
};
