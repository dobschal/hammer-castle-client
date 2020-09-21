import {axios} from "../plugins/axios";
import cookie from "js-cookie";

export const userState = {
  authToken: cookie.get("auth-token"),
  user: undefined
};

export const userMutations = {
  SET_AUTH_TOKEN(state, token) {
    cookie.set("auth-token", token);
    state.authToken = token;
  },
  SET_USER(state, user) {
    state.user = user;
  },
  UPDATE_USER(state, user) {
    for (const key in user) {
      state.user[key] = user[key];
    }
  }
};

export const userActions = {

  async GET_USER({ commit }) {
    try {
      commit("PROGRESS", 1);
      const {
        data: user
      } = await axios.get("/user/current");
      commit("SET_USER", user);
      return user;
    } finally {
      commit("PROGRESS", -1);
    }
  },

  async AUTHENTICATE({ commit }, requestBody) {
    try {
      commit("PROGRESS", 1);
      const {
        data: { token }
      } = await axios.post("/user/authenticate", requestBody);
      commit("SET_AUTH_TOKEN", token);
    } finally {
      commit("PROGRESS", -1);
    }
  },

  async CREATE_USER({ commit }, requestBody) {
    try {
      commit("PROGRESS", 1);
      await axios.post("/user/register", requestBody);
    } finally {
      commit("PROGRESS", -1);
    }
  }
};
