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

        <!--        <path v-for="road in roads" :key="road.id + '1'" :d="road.path" stroke-width="8" stroke="#867350" fill="transparent"/>-->
        <!--        <path v-for="road in roads" :key="road.id + '2'" :d="road.path" stroke-width="5" stroke="#6F4E37" fill="transparent"/>-->
        <svg v-for="road in roads"
             :key="road.id"
             :x="road.middleBetweenCastles.x - road.distanceBetweenCastles * 0.4"
             :y="road.middleBetweenCastles.y - road.distanceBetweenCastles * 0.4"
             :width="road.distanceBetweenCastles * 0.8"
             :height="road.distanceBetweenCastles * 0.8"
             viewBox="0 0 403 403"
             fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <path :style="{transform: 'rotate(' + road.angle + 'deg)', 'transform-origin': '50% 50%' }"
                d="M222.195 504.255L223.33 504.232L223.617 503.135C228.888 482.983 234.822 446.034 234.976 406.023C235.13 366.043 229.515 322.786 211.509 290.172C205.231 278.8 199.772 269.673 195.225 262.07C193.31 258.87 191.557 255.94 189.973 253.226C184.595 244.013 181.191 237.342 179.761 230.88C178.347 224.491 178.84 218.187 181.54 209.694C184.257 201.15 189.172 190.496 196.53 175.425C199.445 169.455 202.086 164.384 204.431 159.88C204.671 159.419 204.908 158.964 205.142 158.515C207.655 153.685 209.819 149.479 211.569 145.512C215.095 137.522 216.958 130.462 216.773 120.962C216.59 111.537 214.393 99.7574 209.929 82.3212C205.702 65.8103 199.414 44.1202 190.803 14.417C190.313 12.726 189.815 11.009 189.309 9.26554L188.632 6.92665L186.848 8.58431L174.535 20.0257L173.878 20.6369L174.106 21.5054C177.23 33.4069 181.697 44.8679 186.08 56.0521L186.293 56.5967C190.613 67.6199 194.825 78.3675 197.661 89.1468C203.4 110.963 203.478 132.793 187.102 156.725C166.164 187.323 160.443 206.064 163.087 225.416C164.398 235.01 167.755 244.67 172.151 255.88C173.344 258.921 174.613 262.077 175.943 265.383C179.53 274.302 183.553 284.305 187.68 296.059C192.048 308.503 196.618 319.17 200.902 329.171C202.104 331.976 203.283 334.729 204.429 337.453C209.668 349.909 214.231 361.82 217.203 375.688C223.141 403.396 222.77 439.134 208.26 502.668L207.833 504.539L209.752 504.501L222.195 504.255Z"
                fill="#6F4E37" stroke="#867350" stroke-width="3"/>
        </svg>

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
    <DialogBox v-if="showDialog" @CLOSE="showDialog = false" :latest-clicked-castle="latestClickedCastle"></DialogBox>
    <NavigationBar :activeAction.sync="activeAction"></NavigationBar>
    <TopNavigationBar></TopNavigationBar>
    <div class="footer">
      <span>Server Version: {{ $store.state.serverVersion }}</span> |
      <button @click="logout">Logout</button>
      |
      <span>Position: {{ viewPosition.x.toFixed(2) }}/{{ viewPosition.y.toFixed(2) }}</span>
      |
      <span>Zoom: {{ zoomFactor.toFixed(2) }}</span>
      |
      <span v-if="user">User: {{ user.id}} / {{ user.color }} / Hammers: {{ user.hammer }} </span>
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
  import TopNavigationBar from "./TopNavigationBar";

  // THe position a roads should start. Depending on the castles level asset... Should be the door position
  // const castleDoorPositions = [
  //   {x: -5, y: 20},
  //   {x: -5, y: 20},
  //   {x: -5, y: 40},
  //   {x: -37, y: 13},
  //   {x: 18, y: 24},
  //   {x: -5, y: 20},
  //   {x: -5, y: 20},
  //   {x: -5, y: 20},
  //   {x: -5, y: 20}
  // ];

  export default {
    name: "Game",
    components: {BlockArea, Castle, BuildCastle, NavigationBar, DialogBox, TopNavigationBar},
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
        const roads = [];
        for (let i = 0; i < this.castles.length; i++) {
          const c1 = this.castles[i];
          for (let j = i + 1; j < this.castles.length; j++) {
            const c2 = this.castles[j];
            const distanceBetweenCastles = this.$util.positionDistance(c1, c2);
            if (distanceBetweenCastles < config.MAX_CASTLE_DISTANCE) {

              // TODO: calculate the angle to rotate the street image

              const angle = Math.floor(Math.atan2(c2.viewPositionY - c1.viewPositionY, c2.viewPositionX - c1.viewPositionX) * 180 / Math.PI) - 90;
              console.log("[Game] Angle of street: ", angle);

              // const path = `
              //   M ${c1.viewPositionX + castleDoorPositions[c1.points].x} ${c1.viewPositionY + castleDoorPositions[c1.points].y}
              //   C ${c1.viewPositionX + castleDoorPositions[c1.points].x - 50} ${c1.viewPositionY + castleDoorPositions[c1.points].y + 50},
              //   ${c2.viewPositionX + 50} ${c2.viewPositionY - 50},
              //   ${c2.viewPositionX + castleDoorPositions[c2.points].x} ${c2.viewPositionY + castleDoorPositions[c2.points].y}
              // `;
              roads.push({
                id: c1.x + "-" + c1.y + "-" + c2.x + "-" + c2.y,
                middleBetweenCastles: {
                  x: (c1.viewPositionX + c2.viewPositionX) / 2,
                  y: (c1.viewPositionY + c2.viewPositionY) / 2
                },
                angle,
                distanceBetweenCastles
                // from: {x: c1.viewPositionX, y: c1.viewPositionY},
                // to: {x: c2.viewPositionX, y: c2.viewPositionY}/*,
                // path*/
              });
            }
          }
        }
        return roads;
      },
      castles() {

        // TODO: Add clean up of not shown castles... remove them from store... and maybe cache somewhere else.

        const gameHeightWithZoom = this.gameHeight * this.zoomFactor;
        const gameWidthWithZoom = this.gameWidth * this.zoomFactor;
        return this.$store.state.castles
                .map(c => {
                  c.viewPositionX = c.x - this.viewPosition.x;
                  c.viewPositionY = c.y - this.viewPosition.y;
                  c.isInConquer = this.$store.state.conquers.some(co => co.castle.x === c.x && co.castle.y === c.y);
                  return c;
                })
                .filter(c => {
                  return Boolean(c.viewPositionX > -200 && c.viewPositionX < gameWidthWithZoom + 200 && c.viewPositionY > -200 && c.viewPositionY < gameHeightWithZoom + 200);
                });
      },
      blockAreas() {
        const gameHeightWithZoom = this.gameHeight * this.zoomFactor;
        const gameWidthWithZoom = this.gameWidth * this.zoomFactor;
        return this.$store.state.blockAreas
                .map(ba => {
                  ba.viewPositionX = ba.x - this.viewPosition.x;
                  ba.viewPositionY = ba.y - this.viewPosition.y;
                  return ba;
                })
                .filter(ba => {
                  return Boolean(ba.viewPositionX > -200 && ba.viewPositionX < gameWidthWithZoom + 200 && ba.viewPositionY > -200 && ba.viewPositionY < gameHeightWithZoom + 200);
                });
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

    created() {
      this.$store.dispatch("GET_USER").then(user => {
        this.moveMapTo({x: user.startX, y: user.startY});
        this.$store.dispatch("GET_CASTLES", {
          fromX: user.startX - 500,
          fromY: user.startY - 500,
          toX: user.startX + 500,
          toY: user.startY + 500
        });
        this.$store.dispatch("GET_CASTLE_PRICE");
      });
      this.$store.dispatch("GET_SERVER_VERSION");
      this.$store.dispatch("GET_BLOCK_AREAS");
      this.$store.dispatch("GET_CONQUERS");
    },

    mounted() {
      this.gameHeight = this.$refs["game-container"].offsetHeight;
      this.gameWidth = this.$refs["game-container"].offsetWidth;

      window.addEventListener("resize", this.onWindowResize);

      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("touchmove", this.onMouseMove);
      document.addEventListener("mouseup", this.onMouseUp);
      document.addEventListener("touchend", this.onMouseUp);
      document.addEventListener("keyup", this.onKeyUp);
      document.addEventListener("mousewheel", this.onScroll);

      this.$refs["game-container"].addEventListener("mousedown", this.onMouseDown);
      this.$refs["game-container"].addEventListener("touchstart", this.onMouseDown, {passive: true});

      this.attachWebsocketListener();
    },

    beforeDestroy() {
      document.removeEventListener("mousemove", this.onMouseMove);
      document.removeEventListener("mouseup", this.onMouseUp);
      document.removeEventListener("mousewheel", this.onScroll);
      this.$refs["game-container"].removeEventListener("mousedown", this.onMouseDown);
      this.$refs["game-container"].removeEventListener("touchstart", this.onMouseDown);
    },

    methods: {

      onWindowResize() {
        this.gameHeight = this.$refs["game-container"].offsetHeight;
        this.gameWidth = this.$refs["game-container"].offsetWidth;
      },

      castleClick(castle) {
        console.log("[Game] Castle click: ", this.user.id, castle.userId);
        if (Date.now() - this.mouseDownTimestamp > 300) return;
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
        [
          "UPDATE_USER",
          "NEW_CASTLE", "UPDATE_CASTLE",
          "NEW_BLOCK_AREA", "UPDATE_BLOCK_AREA",
          "NEW_CONQUER", "UPDATE_CONQUER", "DELETE_CONQUER"
        ].forEach(eventName => {
          this.websocket.on(eventName, data => this.$store.commit(eventName, data));
        })
      },

      onScroll(event) {
        if (this.activeAction === "BUILD_CASTLE") return;
        const delta = event.deltaY * config.SCROLL_SENSITIVITY;
        this.zoomFactor = Math.min(1.3, Math.max(0.7, this.zoomFactor + delta));
        if (this.zoomFactor > 0.7 && this.zoomFactor < 1.3) {
          this.viewPosition.x -= Math.round(delta * this.gameWidth / 2);
          this.viewPosition.y -= Math.round(delta * this.gameHeight / 2);
          this.loadCastles();
        }
      },

      onKeyUp(event) {
        if (event.key === "Escape" || event.key === "Esc") {
          this.activeAction = "";
          this.showDialog = false;
        }
      },

      onMouseDown(event) {
        const x = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
        const y = event.clientY !== undefined ? event.clientY : event.touches[0].clientY;
        this.dragging = true;
        this.lastMousePosition.x = x;
        this.lastMousePosition.y = y;
        this.mouseDownTimestamp = Date.now();
      },
      onMouseMove(event) {
        if (this.waitingForAnimationFrame) return;
        this.waitingForAnimationFrame = true;
        window.requestAnimationFrame(() => {
          const x = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
          const y = event.clientY !== undefined ? event.clientY : event.touches[0].clientY;
          if (this.dragging) {
            this.viewPosition.x += Math.round((this.lastMousePosition.x - x) * this.zoomFactor);
            this.viewPosition.y += Math.round((this.lastMousePosition.y - y) * this.zoomFactor);
          }
          this.lastMousePosition.x = x;
          this.lastMousePosition.y = y;
          this.waitingForAnimationFrame = false;
        });
      },
      onMouseUp() {
        if (this.dragging && Date.now() - this.mouseDownTimestamp > 250) {
          this.loadCastles();
        }
        this.dragging = false;
      },
      logout() {
        this.websocket.disconnect();
        this.$store.commit("SET_AUTH_TOKEN", "");
        this.$store.commit("SET_USER", undefined);
      },
      loadCastles() {
        this.$store.dispatch("GET_CASTLES", {
          fromX: this.viewPosition.x,
          fromY: this.viewPosition.y,
          toX: Math.floor((this.viewPosition.x + this.gameWidth) * this.zoomFactor),
          toY: Math.floor((this.viewPosition.y + this.gameHeight) * this.zoomFactor)
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
