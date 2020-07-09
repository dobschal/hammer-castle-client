<template>
  <Castle :position="newCastlePosition"></Castle>
</template>

<script>
import Castle from "./Castle";

export default {
  name: "BuildCastle",
  components: { Castle },
  props: {
    mouseDownTimestamp: Number,
    dragging: Boolean,
    viewPosition: Object,
    zoomFactor: Number,
    lastMousePosition: Object
  },
  data() {
    return {
      newCastlePosition: { x: 200, y: 200 },
      waitingForAnimationFrame: false
    };
  },
  computed: {
    castles() {
      return this.$store.state.castles;
    }
  },
  watch: {
    zoomFactor () {
      console.log("[BuildCastle] Zoom factor changed: ", this.zoomFactor);
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
        this.waitingForAnimationFrame = false;
      });
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
      this.castles.some(c => {
        const distanceInPixel = this.$util.positionDistance(c, position);
        console.log("[BuildCastle] Distance to existing castle: ", distanceInPixel);
        return false;
      });
      //await this.$store.dispatch("SET_CASTLE", position);
    }
  }
};
</script>
