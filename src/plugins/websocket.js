import config from "../config";
import io from "socket.io-client";
import cookie from "js-cookie";
const event = require("./event.js");

let socket;
let lastHeartbeatTimstamp = undefined;

function connect() {
  if (socket) {
    return socket;
  }
  socket = io(config.API_URL, {
    path: config.WS_PATH,
    query: {
      token: cookie.get("auth-token")
    }
  });

  socket.on("HEARTBEAT", () => {
    const now = Date.now();
    if (lastHeartbeatTimstamp && now - lastHeartbeatTimstamp > 5000) {
      console.warn("[websocket] Heartbeat is delayed, should reload?");
    }
    lastHeartbeatTimstamp = now;
  });

  return socket;
}

function disconnect() {
  if (socket) {
    socket.disconnect();
    socket = undefined;
  }
}

export default {
  install(Vue) {
    Vue.prototype.$websocket = {
      connect,
      disconnect
    };
  }
};
