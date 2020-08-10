import {axios} from "../plugins/axios";

export const castleState = {
  castles: []
};

export const castleMutations = {
  SET_CASTLES(state, castles) {
    state.castles = castles;
  },
  NEW_CASTLE(state, castle) { // injected from websocket
    state.castles.push(castle);
  },
  UPDATE_CASTLE(state, castle) { // injected from websocket
    console.log("[castle] Update castle from websocket: ", castle);
    state.castles = [
      ...state.castles.filter(c => c.x !== castle.x || c.y !== castle.y),
      castle
    ]
  }
};

export const castleActions = {
  async CREATE_CASTLE({commit}, position) {
    try {
      commit("PROGRESS", 1);
      await axios.post("/castle/create", position);
    } finally {
      commit("PROGRESS", -1);
    }
  },
  async GET_CASTLES({ commit }) {
    try {
      commit("PROGRESS", 1);
      const response = await axios.get("/castle");
      commit("SET_CASTLES", response.data);
    } finally {
      commit("PROGRESS", -1);
    }
  }
};
