import {axios} from "../plugins/axios";
import {userActions, userMutations, userState} from "./user";
import {castleActions, castleMutations, castleState} from "./castle";
import {catapultActions, catapultMutations, catapultState} from "./catapult";
import {warehouseActions, warehouseMutations, warehouseState} from "./warehouse";
import {blockAreaActions, blockAreaMutations, blockAreaState} from "./blockArea";
import {actionLogActions, actionLogMutations, actionLogState} from "./actionLog";

export default {
  state: {
    progress: 0,
    serverVersion: undefined,
    ...userState,
    ...castleState,
    ...blockAreaState,
    ...catapultState,
    ...warehouseState,
    ...actionLogState
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
    ...castleMutations,
    ...blockAreaMutations,
    ...catapultMutations,
    ...warehouseMutations,
    ...actionLogMutations
  },
  actions: {
    async GET_SERVER_VERSION({ commit }) {
      try {
        commit("PROGRESS", 1);
        const {
          data: {version}
        } = await axios.get("/public/version");
        commit("SET_SERVER_VERSION", version);
      } finally {
        commit("PROGRESS", -1);
      }
    },
    ...userActions,
    ...castleActions,
    ...blockAreaActions,
    ...catapultActions,
    ...warehouseActions,
    ...actionLogActions
  }
};
