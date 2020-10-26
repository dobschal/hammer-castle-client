<template>
  <g :opacity="opacity">
    <Castle :position="newCastlePosition" :color="user.color"></Castle>
  </g>
</template>

<script>
  import Castle from "./Castle";
  import config from "../../config";

  export default {
    name: "BuildCastle",
    components: {Castle},
    props: {
      mouseDownTimestamp: Number,
      dragging: Boolean,
      pageOverlayOpen: Boolean,
      viewPosition: Object,
      zoomFactor: Number,
      lastMousePosition: Object,
      user: Object
    },

    data() {
      return {
        newCastlePosition: {x: window.innerWidth / 2, y: window.innerHeight / 2},
        waitingForAnimationFrame: false,
        validDistance: false,
        isTouchDevice: false,
        buildPosition: undefined
      };
    },

    computed: {
      isFirstCastle() {
        return !this.castles.some(c => c.userId === this.user.id);
      },
      castles() {
        return this.$store.state.castles;
      },
      blockAreas() {
        return this.$store.state.blockAreas;
      },
      opacity() {
        return this.validDistance ? "1" : "0.3";
      }
    },

    watch: {
      zoomFactor() {

        // TODO: Correct?

        this.newCastlePosition.x = this.lastMousePosition.x * this.zoomFactor;
        this.newCastlePosition.y = this.lastMousePosition.y * this.zoomFactor;
        this.$emit("NEW_CASTLE_POSITION", this.newCastlePosition);
      },
      "viewPosition.x"() {
        if (this.isTouchDevice) {
          this.newCastlePosition.x = this.viewPosition.x + (window.innerWidth / 2 * this.zoomFactor);
          this.newCastlePosition.y = this.viewPosition.y + (window.innerHeight / 2 * this.zoomFactor);
          this.hasCastleValidDistance(this.newCastlePosition);
        }
      }
    },

    mounted() {
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseup", this.onMouseUp);
      document.addEventListener("touchstart", this.onTouchStart);
      this.newCastlePosition.x = this.viewPosition.x + (window.innerWidth / 2 * this.zoomFactor);
      this.newCastlePosition.y = this.viewPosition.y + (window.innerHeight / 2 * this.zoomFactor);
      this.hasCastleValidDistance(this.newCastlePosition);
    },

    beforeDestroy() {
      this.$emit("NEW_CASTLE_POSITION", undefined);
      document.removeEventListener("mousemove", this.onMouseMove);
      document.removeEventListener("mouseup", this.onMouseUp);
      document.removeEventListener("touchstart", this.onTouchStart);
    },

    methods: {
      onTouchStart() {
        this.isTouchDevice = true;
      },
      onMouseMove(event) {
        if (this.isTouchDevice) return;
        if (this.waitingForAnimationFrame) return;
        this.waitingForAnimationFrame = true;
        window.requestAnimationFrame(() => {
          this.newCastlePosition.x = this.viewPosition.x + (event.clientX * this.zoomFactor);
          this.newCastlePosition.y = this.viewPosition.y + (event.clientY * this.zoomFactor);
          this.hasCastleValidDistance(this.newCastlePosition);
          this.waitingForAnimationFrame = false;
        });
      },

      hasCastleValidDistance(position) {
        if (this.blockAreas.length > 0) {
          for (let i = 0; i < this.blockAreas.length; i++) {
            const blockArea = this.blockAreas[i];
            const distanceInPixel = this.$util.positionDistance(blockArea, position);
            if (distanceInPixel < config.BLOCK_AREA_SIZE) {
              this.validDistance = false;
              return false;
            }
          }
        }

        this.validDistance = false;
        if (this.castles.length === 0) {
          this.validDistance = true;
        } else {
          for (let i = 0; i < this.castles.length; i++) {
            const castle = this.castles[i];
            const distanceInPixel = this.$util.positionDistance(castle, position);
            if (distanceInPixel < config.MIN_CASTLE_DISTANCE) {
              this.validDistance = false;
              break;
            } else if ((distanceInPixel < config.MAX_CASTLE_DISTANCE && castle.userId === this.user.id) || this.isFirstCastle) {
              this.validDistance = true;
            }
          }
        }

        if (this.validDistance) {
          this.$emit("NEW_CASTLE_POSITION", this.newCastlePosition);
        }

        return this.validDistance;
      },

      onMouseUp(event) {
        if (Date.now() - this.mouseDownTimestamp < 300) {
          this.onClick(event);
        }
      },

      async onClick(event) {
        if (this.isTouchDevice) return;
        this.newCastlePosition.x = this.viewPosition.x + (event.clientX * this.zoomFactor);
        this.newCastlePosition.y = this.viewPosition.y + (event.clientY * this.zoomFactor);
        this.buildCastle();
      },

      async buildCastle() {
        const position = this.newCastlePosition;
        if (this.hasCastleValidDistance(position)) {
          try {
            await this.$store.dispatch("CREATE_CASTLE", position);
            await this.$store.dispatch("GET_CASTLE_PRICE");
            await this.$store.dispatch("GET_CATAPULT_PRICE");
          } catch (e) {
            console.log("[BuildCastle] Cannot build castle: ", e, e.response);
            this.$emit("ERROR", e.response.data.message);
          }
          this.$emit("DONE");
        } else {
          console.log("[BuildCastle] Invalid castle position: ", position);
        }
      }
    }
  };
</script>
