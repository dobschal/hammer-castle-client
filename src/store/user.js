import { axios } from "../plugins/axios";
import cookie from "js-cookie";

export const userState = {
  authToken: cookie.get("auth-token")
};

export const userMutations = {
  SET_AUTH_TOKEN(state, token) {
    cookie.set("auth-token", token);
    state.authToken = token;
  }
};

export const userActions = {
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
  }
};
