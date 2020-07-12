<template>
  <div>
    <div class="game-container" ref="game-container">
      <svg
              :width="gameWidth + 'px'"
              :height="gameHeight + 'px'"
              :viewBox="gameViewBox"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
      >

        <path v-for="road in roads" :key="road.id" :d="road.path" stroke-width="5" stroke="#A8937D" fill="transparent"/>

        <BuildCastle
                v-if="activeAction === 'BUILD_CASTLE'"
                :user="user"
                :zoom-factor="zoomFactor"
                :last-mouse-position="lastMousePosition"
                :mouse-down-timestamp="mouseDownTimestamp"
                :dragging="dragging"
                :view-position="viewPosition"
        ></BuildCastle>

        <g v-for="castle in castles" :key="castle.x + '' + castle.y">
          <Castle :position="{ x: castle.x - viewPosition.x, y: castle.y - viewPosition.y }"
                  :castle="castle"
                  :color="castle.color"></Castle>
        </g>

      </svg>
    </div>
    <NavigationBar :activeAction.sync="activeAction"></NavigationBar>
    <div class="footer">
      <span>Server Version: {{ $store.state.serverVersion }}</span> |
      <button @click="logout">Logout</button>
      |
      <span>Position: {{ viewPosition.x.toFixed(2) }}/{{ viewPosition.y.toFixed(2) }}</span>
      |
      <span>Zoom: {{ zoomFactor.toFixed(2) }}</span>
      |
      <span v-if="user">User: {{ user.id}} / {{ user.color }} </span>
    </div>
  </div>
</template>

<script>
  import Castle from "./Castle";
  import BuildCastle from "./BuildCastle";
  import NavigationBar from "./NavigationBar";
  import config from "../config";

  export default {
    name: "Game",
    components: {Castle, BuildCastle, NavigationBar},
    data() {
      return {
        dragging: false,
        waitingForAnimationFrame: false,

        gameHeight: 0,
        gameWidth: 0,

        zoomFactor: 1,
        mouseDownTimestamp: 0,
        viewPosition: {x: 0, y: 0},
        lastMousePosition: {x: 0, y: 0},

        activeAction: "",

        websocket: undefined
      };
    },

    computed: {
      roads() {

        //  TODO: move that offthread or to server

        const roads = [];
        for (let i = 0; i < this.castles.length; i++) {
          const c1 = this.castles[i];
          for (let j = i + 1; j < this.castles.length; j++) {
            const c2 = this.castles[j];
            const distanceBetweenCastles = this.$util.positionDistance(c1, c2);
            if (distanceBetweenCastles < config.MAX_CASTLE_DISTANCE) {
              const path = `
                M ${c1.x - this.viewPosition.x} ${c1.y - this.viewPosition.y}
                C ${c1.x - this.viewPosition.x - 17} ${c1.y - this.viewPosition.y + 32},
                ${c2.x - this.viewPosition.x + 23} ${c2.y - this.viewPosition.y - 34},
                ${c2.x - this.viewPosition.x} ${c2.y - this.viewPosition.y}
              `;
              roads.push({
                id: c1.x + "-" + c1.y + "-" + c2.x + "-" + c2.y,
                from: {x: c1.x, y: c1.y},
                to: {x: c2.x, y: c2.y},
                path
              });
            }
          }
        }
        return roads;
      },
      castles() {
        return this.$store.state.castles;
      },
      loading() {
        return this.$store.getters.busy;
      },
      gameViewBox() {
        const width = Math.max(0, Math.floor(this.gameWidth * this.zoomFactor));
        const height = Math.max(0, Math.floor(this.gameHeight * this.zoomFactor));
        return '0 0 ' + width + ' ' + height;
      },
      user() {
        return this.$store.state.user;
      }
    },

    watch: {

      activeAction(val) {
        if (val === "BUILD_CASTLE") {

          //  TODO: this is a hotfix, cause the zoomFactor is missing in the distance calculation on build castle

          this.zoomFactor = 1;
        }
      }
    },

    beforeCreate() {
      this.$store.dispatch("GET_USER");
      this.$store.dispatch("GET_SERVER_VERSION");
      this.$store.dispatch("GET_CASTLES");
    }
    ,

    mounted() {
      this.gameHeight = this.$refs["game-container"].offsetHeight;
      this.gameWidth = this.$refs["game-container"].offsetWidth;

      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseup", this.onMouseUp);
      document.addEventListener("keyup", this.onKeyUp);
      document.addEventListener("mousewheel", this.onScroll);

      this.$refs["game-container"].addEventListener("mousedown", this.onMouseDown);

      this.attachWebsocketListener();
    },

    beforeDestroy() {
      document.removeEventListener("mousemove", this.onMouseMove);
      document.removeEventListener("mouseup", this.onMouseUp);
      document.removeEventListener("mousewheel", this.onScroll);
      this.$refs["game-container"].removeEventListener("mousedown", this.onMouseDown);
    },

    methods: {

      attachWebsocketListener () {
        this.websocket = this.$websocket.connect();
        ["NEW_CASTLE"].forEach(eventName => {
          this.websocket.on(eventName, data => this.$store.commit(eventName, data));
        })
      },

      onScroll(event) {
        if (this.activeAction === "BUILD_CASTLE") return;
        const delta = event.deltaY * config.SCROLL_SENSITIVITY;
        this.zoomFactor = Math.max(0.2, this.zoomFactor + delta);
        if(this.zoomFactor > 0.2) {
          this.viewPosition.x -= delta * this.gameHeight / 2;
          this.viewPosition.y -= delta * this.gameHeight / 2;
        }
      },

      onKeyUp(event) {
        if (event.key === "Escape" || event.key === "Esc") {
          this.activeAction = "";
        }
      },

      onMouseDown(event) {
        this.dragging = true;
        this.lastMousePosition.x = event.clientX;
        this.lastMousePosition.y = event.clientY;
        this.mouseDownTimestamp = Date.now();
      },
      onMouseMove(event) {
        if (this.waitingForAnimationFrame) return;
        this.waitingForAnimationFrame = true;
        window.requestAnimationFrame(() => {
          if (this.dragging) {
            this.viewPosition.x += (this.lastMousePosition.x - event.clientX) * this.zoomFactor;
            this.viewPosition.y += (this.lastMousePosition.y - event.clientY) * this.zoomFactor;
          }
          this.lastMousePosition.x = event.clientX;
          this.lastMousePosition.y = event.clientY;
          this.waitingForAnimationFrame = false;
        });
      },
      onMouseUp(event) {
        this.dragging = false;
        if (Date.now() - this.mouseDownTimestamp < 300) {
          this.onClick(event);
        }
      },
      async onClick() {
        console.log("[Game] Click");
      },
      logout() {
        this.$store.commit("SET_AUTH_TOKEN", "");
      }
    }
  };
</script>

<style lang="scss" scoped>
  .game-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 1;
    cursor: grab;
    background-color: #b6e57b;
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 2;
    padding: 0.5rem 1rem;

    button {
      font-size: 0.8rem;
    }

    span {
      color: #3B3B3B;
      font-size: 0.8rem;
    }
  }
</style>
