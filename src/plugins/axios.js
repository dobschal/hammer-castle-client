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
    response.data = propsToCamelCase(response.data);
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

/**
 * It converts the property keys to camelCase:
 * E.g.: user_id --> userId
 * @param {object} data
 * @return {object}
 */
export function propsToCamelCase(data) {
  if (!data || typeof data !== "object") return data;
  Object.keys(data).forEach(key => {
    if (data[key] && typeof data[key] === "object") {
      data[key] = propsToCamelCase(data[key]);
    } else if (data[key] && Array.isArray(data[key])) {
      data[key] = data[key].map(propsToCamelCase);
    }
    if (key.includes("_")) {
      const newKey = convertSnakeCaseToCamelCase(key);
      data[newKey] = data[key];
      delete data[key];
    }
  });
  return data;
}

/**
 * @param {string} text
 * @return {string}
 */
function convertSnakeCaseToCamelCase(text) {
  return text.replace(
      /([-_][a-z0-9])/g,
      (group) => group.toUpperCase()
          .replace('-', '')
          .replace('_', '')
  );
}

export default {
  install(Vue) {
    Vue.prototype.$axios = axios;
  }
};
