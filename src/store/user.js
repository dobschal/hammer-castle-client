import {axios} from "../plugins/axios";
import cookie from "js-cookie";

export const userState = {
  authToken: cookie.get("auth-token"),
  user: undefined,
  ranking: []
};

export const userMutations = {
  SET_AUTH_TOKEN(state, token) {
    cookie.set("auth-token", token, {expires: 7});
    state.authToken = token;
  },
  SET_USER(state, user) {
    state.user = user;
  },
  UPDATE_USER(state, user) {
    for (const key in user) {
      state.user[key] = user[key];
    }
  },
  SET_RANKING(state, ranking) {
    state.ranking = ranking;
  }
};

export const userActions = {

  async CLAIM_DAILY_REWARD({commit}) {
    try {
      commit("PROGRESS", 1);
      await axios.post("/user/daily-reward");
    } finally {
      commit("PROGRESS", -1);
    }
  },

  async MARK_AS_HOME({commit}, position) {
    try {
      commit("PROGRESS", 1);
      await axios.post("/user/mark-as-home", position);
    } finally {
      commit("PROGRESS", -1);
    }
  },

  async GET_USER({commit}) {
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

  async IS_ONLINE({commit}, username) {
    try {
      commit("PROGRESS", 1);
      const response = await axios.get("/user/is-online?username=" + encodeURIComponent(username));
      return response.data.isOnline;
    } finally {
      commit("PROGRESS", -1);
    }
  },

  async GET_HOME_POSITION({commit}, userId) {
    try {
      commit("PROGRESS", 1);
      const response = await axios.get("/user/home?user_id=" + userId);
      return response.data.position;
    } finally {
      commit("PROGRESS", -1);
    }
  },

  async GET_RANKING({commit}) {
    try {
      commit("PROGRESS", 1);
      const response = await axios.get("/user/ranking");
      commit("SET_RANKING", response.data);
    } finally {
      commit("PROGRESS", -1);
    }
  },

  async AUTHENTICATE({commit}, requestBody) {
    try {
      commit("PROGRESS", 1);
      const {
        data: {token}
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
