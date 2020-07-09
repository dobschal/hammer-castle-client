import config from "../config";
import io from "socket.io-client";
import cookie from "js-cookie";

let socket;

function connect() {
  if (socket) {
    return socket;
  }
  socket = io(config.API_URL, {
    query: {
      token: cookie.get("auth-token")
    }
  });
  socket.on("HEARTBEAT", data => {
    console.log("[Game] Got heartbeat: ", data);
  });
  return socket;
}

export default {
  install(Vue) {
    Vue.prototype.$websocket = {
      connect
    };
  }
};
