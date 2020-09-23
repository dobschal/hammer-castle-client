import config from "../config";
import io from "socket.io-client";
import cookie from "js-cookie";

let socket;

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

  socket.on("HEARTBEAT", data => {
    console.log("[websocket] Got heartbeat: ", data);
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
