<template>
  <div>
    <div class="game-container" ref="game-container">
      <svg
              :width="gameWidth + 'px'"
              :height="gameHeight + 'px'"
              :viewBox="'0 0 ' + Math.max(0, Math.floor(gameWidth * zoomFactor)) + ' ' + Math.max(0, Math.floor(gameHeight * zoomFactor))"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
      >
        <BuildCastle
                v-if="activeAction === 'BUILD_CASTLE'"
                :mouse-down-timestamp="mouseDownTimestamp"
                :dragging="dragging"
                :view-position="viewPosition"
        ></BuildCastle>
        <g v-for="castle in castles" :key="castle.x + '' + castle.y">
          <Castle :position="{ x: castle.x - viewPosition.x, y: castle.y - viewPosition.y }"></Castle>
        </g>
      </svg>
    </div>
    <NavigationBar @build-castle="activeAction = 'BUILD_CASTLE'"></NavigationBar>
    <div class="footer">
      <span>Server Version: {{ $store.state.serverVersion }}</span> |
      <button @click="logout">Logout</button>
      |
      <span>Position: {{ viewPosition.x }}/{{ viewPosition.y }}</span>
      |
      <span>Zoom: {{ zoomFactor }}</span>
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

        activeAction: ""
      };
    },
    computed: {
      castles() {
        return this.$store.state.castles;
      },
      loading() {
        return this.$store.getters.busy;
      }
    },
    watch: {
      activeAction() {

      }
    },
    created() {
      this.$store.dispatch("GET_SERVER_VERSION");
      this.$store.dispatch("GET_CASTLES");
    },

    mounted() {
      this.gameHeight = this.$refs["game-container"].offsetHeight;
      this.gameWidth = this.$refs["game-container"].offsetWidth;

      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseup", this.onMouseUp);
      document.addEventListener("keyup", this.onKeyUp);
      document.addEventListener("mousewheel", this.onScroll);

      this.$refs["game-container"].addEventListener("mousedown", this.onMouseDown);

      this.$websocket.connect();
    },

    beforeDestroy() {
      document.removeEventListener("mousemove", this.onMouseMove);
      document.removeEventListener("mouseup", this.onMouseUp);
      document.removeEventListener("mousewheel", this.onScroll);
      this.$refs["game-container"].removeEventListener("mousedown", this.onMouseDown);
    },

    methods: {

      onScroll(event) {
        console.log("[Game] Scrolling: ", event);
        this.zoomFactor += event.deltaY * config.SCROLL_SENSITIVITY;
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
            this.viewPosition.x += this.lastMousePosition.x - event.clientX;
            this.viewPosition.y += this.lastMousePosition.y - event.clientY;
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

<style scoped>
  .game-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 1;
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 2;
  }
</style>
