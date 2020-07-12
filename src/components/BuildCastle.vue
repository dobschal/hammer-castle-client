<template>
  <svg :opacity="opacity">
    <Castle :position="newCastlePosition" :color="user.color"></Castle>
  </svg>
</template>

<script>
  import Castle from "./Castle";
  import config from "../config";

  export default {
    name: "BuildCastle",
    components: {Castle},
    props: {
      mouseDownTimestamp: Number,
      dragging: Boolean,
      viewPosition: Object,
      zoomFactor: Number,
      lastMousePosition: Object,
      user: Object
    },
    data() {
      return {
        newCastlePosition: {x: 200, y: 200},
        waitingForAnimationFrame: false,
        validDistance: false
      };
    },
    computed: {
      isFirstCastle() {
        return !this.castles.some(c => c.user_id === this.user.id);
      },
      castles() {
        return this.$store.state.castles;
      },
      opacity() {
        return this.validDistance ? "1" : "0.3";
      }
    },
    watch: {
      zoomFactor() {
        this.newCastlePosition.x = this.lastMousePosition.x * this.zoomFactor;
        this.newCastlePosition.y = this.lastMousePosition.y * this.zoomFactor;
      }
    },
    mounted() {
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseup", this.onMouseUp);
    },
    beforeDestroy() {
      document.removeEventListener("mousemove", this.onMouseMove);
      document.removeEventListener("mouseup", this.onMouseUp);
    },
    methods: {
      onMouseMove(event) {
        if (this.waitingForAnimationFrame) return;
        this.waitingForAnimationFrame = true;
        window.requestAnimationFrame(() => {
          this.newCastlePosition.x = event.clientX * this.zoomFactor;
          this.newCastlePosition.y = event.clientY * this.zoomFactor;
          this.hasCastleValidDistance({
            x: (this.viewPosition.x + event.clientX) * this.zoomFactor,
            y: (this.viewPosition.y + event.clientY) * this.zoomFactor
          });
          this.waitingForAnimationFrame = false;
        });
      },
      hasCastleValidDistance(position) {
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
            } else if ((distanceInPixel < config.MAX_CASTLE_DISTANCE && castle.user_id === this.user.id) || this.isFirstCastle) {
              this.validDistance = true;
            }
          }
        }
        return this.validDistance;
      },
      onMouseUp(event) {
        if (Date.now() - this.mouseDownTimestamp < 300) {
          this.onClick(event);
        }
      },
      async onClick(event) {
        const position = {
          x: this.viewPosition.x + event.clientX,
          y: this.viewPosition.y + event.clientY
        };
        if (this.hasCastleValidDistance(position)) {
          await this.$store.dispatch("SET_CASTLE", position);
          await this.$store.dispatch("GET_CASTLES");
        } else {
          console.log("[BuildCastle] Invalid castle position: ", position);
        }
      }
    }
  };
</script>
