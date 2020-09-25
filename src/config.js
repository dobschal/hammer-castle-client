// eslint-disable-next-line
const isDev = process.env.NODE_ENV === "development";

console.log("[config] Running in dev mode?: ", isDev);

export default {
  API_URL: isDev ? "http://192.168.178.20:8082" : "https://hammercastle.de",
  API_PATH: "/api",
  WS_PATH: "/api/ws",
  REQUEST_TIMEOUT: 10000,
  SCROLL_SENSITIVITY: 0.003,
  MIN_CASTLE_DISTANCE: 200,
  MAX_CASTLE_DISTANCE: 300,
  BLOCK_AREA_SIZE: 150, // Radius!
  CATAPULT_LIFETIME: 1000 * 60 * 5
};
