// eslint-disable-next-line
const isDev = process.env.NODE_ENV === "development";

export default {
  API_URL: isDev ? "http://localhost:8082" : "",
  REQUEST_TIMEOUT: 10000,
  SCROLL_SENSITIVITY: 0.003
};
