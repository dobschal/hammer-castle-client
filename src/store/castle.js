import {axios} from "../plugins/axios";

export const castleState = {
  castles: []
};

export const castleMutations = {

  /**
   * @define Castle {{ x: number, y: number, user_id: number, username: string, color: string }}
   * @param state
   * @param {Castle[]} castles
   */
  SET_CASTLES(state, castles) {
    state.castles = castles;
  },

  CASTLE_USER_CHANGE(state, {x, y, userId, username, color}) {
    for (let i = 0; i < state.castles.length; i++) {
      if (state.castles[i].x === x && state.castles[i].y === y) {
        state.castles[i].user_id = userId;
        state.castles[i].username = username;
        state.castles[i].color = color;
        console.log("[castle] Castle user changed: ", state.castles[i]);
        break;
      }
    }
  }
};

export const castleActions = {
  async SET_CASTLE({ commit }, position) {
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
