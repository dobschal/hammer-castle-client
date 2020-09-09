// eslint-disable-next-line
const isDev = process.env.NODE_ENV === "development";

export default {
  API_URL: isDev ? "http://localhost:8082" : "",
  REQUEST_TIMEOUT: 10000,
  SCROLL_SENSITIVITY: 0.003,
  MIN_CASTLE_DISTANCE: 200,
  MAX_CASTLE_DISTANCE: 300,
  BLOCK_AREA_SIZE: 150 // Radius!
};
