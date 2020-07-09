import Axios from "axios";
import config from "../config";
import cookie from "js-cookie";

const axiosConfig = {
  baseURL: config.API_URL,
  timeout: config.REQUEST_TIMEOUT
};

export const axios = Axios.create(axiosConfig);

axios.interceptors.request.use(function(config) {
  if (cookie.get("auth-token")) {
    config.headers.Authorization = "Bearer " + cookie.get("auth-token");
  }
  return config;
});

axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.message &&
      error.response.data.message.includes("expired")
    ) {
      try {
        cookie.remove("auth-token");
        window.location.reload(true);
      } catch (e) {
        console.warn("[Axios] Couldn't remove auth token from local storage.");
      }
    } else {
      throw error;
    }
  }
);

export default {
  install(Vue) {
    Vue.prototype.$axios = axios;
  }
};
