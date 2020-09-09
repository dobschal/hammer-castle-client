import {axios} from "../plugins/axios";

export const castleState = {
  castles: []
};

export const castleMutations = {
  SET_CASTLES(state, castles) {
    if (state.castles.length === 0) {
      state.castles = castles;
    } else {
      castles.forEach(c1 => {
        if (!state.castles.some(c2 => c1.x === c2.x && c1.y === c2.y)) {
          state.castles.push(c1);
        }
      });
    }
  },
  NEW_CASTLE(state, castle) { // injected from websocket
    state.castles.push(castle);
  },
  UPDATE_CASTLE(state, castle) { // injected from websocket
    state.castles = [
      ...state.castles.filter(c => c.x !== castle.x || c.y !== castle.y),
      castle
    ];
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
  async CHANGE_CASTLE_NAME({commit}, positionAndName) {
    console.log("[castle] Change castle name: ", positionAndName);
    try {
      commit("PROGRESS", 1);
      await axios.post("/castle/change-name", positionAndName);
    } finally {
      commit("PROGRESS", -1);
    }
  },
  async GET_CASTLES({commit}, {fromX, fromY, toX, toY}) {
    try {
      commit("PROGRESS", 1);
      const response = await axios.get(`/castle?fromX=${fromX}&fromY=${fromY}&toX=${toX}&toY=${toY}`);
      commit("SET_CASTLES", response.data);
    } finally {
      commit("PROGRESS", -1);
    }
  }
};
