// eslint-disable-next-line
const isDev = process.env.NODE_ENV === "development";

export default {
  API_URL: isDev ? "https://ltcgy.sse.codesandbox.io" : "",
  REQUEST_TIMEOUT: 10000
};
