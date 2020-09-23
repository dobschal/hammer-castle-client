import Axios from "axios";
import config from "../config";
import cookie from "js-cookie";

const axiosConfig = {
  baseURL: config.API_URL + config.API_PATH,
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
    if (error.response && error.response.data && (
        (error.response.data.message && error.response.data.message.includes("expired"))
        || (typeof error.response.data === "string" && error.response.data.includes("expired")))) {
      cookie.remove("auth-token");
      console.log("[axios] Token expired: ", error);
      window.location.reload(true);
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
