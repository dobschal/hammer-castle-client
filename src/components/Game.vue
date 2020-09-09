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
                @DONE="activeAction = ''"
        ></BuildCastle>

        <g v-for="blockArea in blockAreas" :key="blockArea.x + '' + blockArea.y">
          <BlockArea :position="{ x: blockArea.x - viewPosition.x, y: blockArea.y - viewPosition.y }"></BlockArea>
        </g>

        <g v-for="castle in castles" :key="castle.x + '' + castle.y">
          <Castle :position="{ x: castle.x - viewPosition.x, y: castle.y - viewPosition.y }"
                  :castle="castle"
                  :color="castle.color"
                  @CLICK="castleClick($event)"></Castle>
        </g>

      </svg>
    </div>
    <DialogBox v-if="showDialog" @CLOSE="showDialog = false" @SUBMIT="dialogSubmit"></DialogBox>
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
  import BlockArea from "./BlockArea";
  import DialogBox from "./DialogBox";

  export default {
    name: "Game",
    components: {BlockArea, Castle, BuildCastle, NavigationBar, DialogBox},
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
        showDialog: false,
        websocket: undefined,

        activeAction: "",
        latestClickedCastle: undefined
      };
    },

    computed: {
      roads() {

        //  TODO: move that offthread or to server

        const t1 = Date.now();
        const roads = [];
        for (let i = 0; i < this.castles.length; i++) {
          const c1 = this.castles[i];
          for (let j = i + 1; j < this.castles.length; j++) {
            const c2 = this.castles[j];
            const distanceBetweenCastles = this.$util.positionDistance(c1, c2);
            if (distanceBetweenCastles < config.MAX_CASTLE_DISTANCE) {
              const path = `
                M ${c1.viewPositionX} ${c1.viewPositionY}
                C ${c1.viewPositionX - 17} ${c1.viewPositionY + 32},
                ${c2.viewPositionX + 23} ${c2.viewPositionY - 34},
                ${c2.viewPositionX} ${c2.viewPositionY}
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
        console.log("[Game] Roads in: ", (Date.now() - t1) + "ms");
        return roads;
      },
      castles() {
        const filteredCastles = this.$store.state.castles
                .map(c => {
                  c.viewPositionX = c.x - this.viewPosition.x;
                  c.viewPositionY = c.y - this.viewPosition.y;
                  return c;
                })
                .filter(c => {
                  return Boolean(c.viewPositionX > 0 && c.viewPositionX < this.gameWidth && c.viewPositionY > 0 && c.viewPositionY < this.gameHeight);
                });
        console.log("[Game] Castles loaded vs viewed: ", this.$store.state.castles.length, filteredCastles.length);
        return filteredCastles;
      },
      blockAreas() {
        const filteredBlockAreas = this.$store.state.blockAreas
                .map(ba => {
                  ba.viewPositionX = ba.x - this.viewPosition.x;
                  ba.viewPositionY = ba.y - this.viewPosition.y;
                  return ba;
                })
                .filter(ba => {
                  return Boolean(ba.viewPositionX > 0 && ba.viewPositionX < this.gameWidth && ba.viewPositionY > 0 && ba.viewPositionY < this.gameHeight);
                });
        console.log("[Game] Block areas loaded vs viewed: ", this.$store.state.blockAreas.length, filteredBlockAreas);
        return filteredBlockAreas;
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
      }/*,

      castles(to, from) {
        if (from.length === 0 && to.length > 0) {
          const firstCastle = to.find(c => c.userId === this.user.id);
          console.log("[Game] First castle: ", firstCastle, to[0].userId, this.user.id);
          if (firstCastle) this.moveMapTo(firstCastle);
        }
      }*/
    },

    created() {
      this.$store.dispatch("GET_USER").then(user => {
        console.log("[Game] Go user: ", user);
        this.moveMapTo({x: user.startX, y: user.startY});
        this.$store.dispatch("GET_CASTLES", {
          fromX: user.startX - 500,
          fromY: user.startY - 500,
          toX: user.startX + 500,
          toY: user.startY + 500
        });
      });
      this.$store.dispatch("GET_SERVER_VERSION");
      this.$store.dispatch("GET_BLOCK_AREAS");
    },

    mounted() {
      console.log("[Game] Castles amount: ", this.castles.length);
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

      dialogSubmit(newCastleName) {
        console.log("[Game] New castle name fro: ", newCastleName, this.latestClickedCastle);

        this.$store.dispatch("CHANGE_CASTLE_NAME", {
          x: this.latestClickedCastle.x,
          y: this.latestClickedCastle.y,
          name: newCastleName
        });

        this.showDialog = false;
      },

      castleClick(castle) {
        if (castle.userId === this.user.id) {
          this.showDialog = true;
        }
        this.latestClickedCastle = castle;
      },

      moveMapTo(position) {
        this.viewPosition.x = position.x - window.innerWidth / 2;
        this.viewPosition.y = position.y - window.innerHeight / 2;
      },

      attachWebsocketListener() {
        this.websocket = this.$websocket.connect();
        ["NEW_CASTLE", "UPDATE_CASTLE", "NEW_BLOCK_AREA", "UPDATE_BLOCK_AREA"].forEach(eventName => {
          this.websocket.on(eventName, data => this.$store.commit(eventName, data));
        })
      },

      onScroll(event) {
        if (this.activeAction === "BUILD_CASTLE") return;
        const delta = event.deltaY * config.SCROLL_SENSITIVITY;
        this.zoomFactor = Math.min(2, Math.max(0.5, this.zoomFactor + delta));
        if (this.zoomFactor > 0.5 && this.zoomFactor < 2) {
          this.viewPosition.x -= Math.round(delta * this.gameWidth / 2);
          this.viewPosition.y -= Math.round(delta * this.gameHeight / 2);
          this.loadCastles();
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
            this.viewPosition.x += Math.round((this.lastMousePosition.x - event.clientX) * this.zoomFactor);
            this.viewPosition.y += Math.round((this.lastMousePosition.y - event.clientY) * this.zoomFactor);
          }
          this.lastMousePosition.x = event.clientX;
          this.lastMousePosition.y = event.clientY;
          this.waitingForAnimationFrame = false;
        });
      },
      onMouseUp() {
        if (this.dragging && Date.now() - this.mouseDownTimestamp > 250) {
          this.loadCastles();
        }
        this.dragging = false;
        // if (Date.now() - this.mouseDownTimestamp < 300) {
        //   this.onClick(event);
        // }
      },
      // async onClick() {
      //   console.log("[Game] Click");
      // },
      logout() {

        // TODO: disconnect websocket and remove user data

        this.$store.commit("SET_AUTH_TOKEN", "");
      },
      loadCastles() {
        console.log("[Game] Load data: ", this.viewPosition.x, this.viewPosition.y);

        // TODO: add zoom factor to calculation...

        this.$store.dispatch("GET_CASTLES", {
          fromX: this.viewPosition.x,
          fromY: this.viewPosition.y,
          toX: Math.floor(this.viewPosition.x + this.gameWidth * this.zoomFactor),
          toY: Math.floor(this.viewPosition.y + this.gameHeight * this.zoomFactor)
        });
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

    &:hover {
      cursor: grab;
    }
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
