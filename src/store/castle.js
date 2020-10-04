import {axios} from "../plugins/axios";

export const castleState = {
  castles: [],
  castlePrice: 0,
  conquers: []
};

export const castleMutations = {
  SET_CASTLES(state, castles) {
    // if (state.castles.length === 0) {
    state.castles = castles;
    // } else {
    //   castles.forEach(c1 => {
    //     if (!state.castles.some(c2 => c1.x === c2.x && c1.y === c2.y)) {
    //       state.castles.push(c1);
    //     }
    //   });
    // }
  },
  SET_CASTLE_PRICE(state, {price}) { // injected from websocket
    state.castlePrice = price;
  },
  NEW_CASTLE(state, castle) { // injected from websocket
    state.castles = [
      ...state.castles.filter(c => c.x !== castle.x || c.y !== castle.y),
      castle
    ];
  },
  DELETE_CASTLE(state, castle) {
    console.log("[castle] Delete castle: ", castle);
    state.castles = state.castles.filter(c => c.x !== castle.x || c.y !== castle.y);
  },
  UPDATE_CASTLE(state, castle) { // injected from websocket
    state.castles = [
      ...state.castles.filter(c => c.x !== castle.x || c.y !== castle.y),
      castle
    ];
  },
  SET_CONQUERS(state, conquers) {
    state.conquers = conquers;
  },
  NEW_CONQUER(state, conquer) {
    console.log("[castle] New conquer: ", conquer);
    state.conquers.push(conquer);
  },
  UPDATE_CONQUER(state, conquer) {
    console.log("[castle] Update conquer: ", conquer);
    state.conquers = [
      ...state.conquers.filter(c => c.castle.x !== conquer.castle.x || c.castle.y !== conquer.castle.y),
      conquer
    ];
  },
  DELETE_CONQUER(state, conquer) {
    console.log("[castle] Delete conquer: ", conquer);
    state.conquers = state.conquers.filter(c => c.castle.x !== conquer.castle.x || c.castle.y !== conquer.castle.y);
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
  async DELETE_CASTLE({commit}, position) {
    try {
      commit("PROGRESS", 1);
      await axios.delete("/castle?x=" + position.x + "&y=" + position.y);
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
  },
  async GET_CASTLE_PRICE({commit}) {
    try {
      commit("PROGRESS", 1);
      const response = await axios.get(`/castle/price`);
      commit("SET_CASTLE_PRICE", response.data);
    } finally {
      commit("PROGRESS", -1);
    }
  },
  async GET_CONQUERS({commit}) {
    try {
      commit("PROGRESS", 1);
      const response = await axios.get(`/castle/conquers`);
      commit("SET_CONQUERS", response.data);
    } finally {
      commit("PROGRESS", -1);
    }
  }
};
