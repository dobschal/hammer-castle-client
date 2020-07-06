<template>
  <Castle :position="firstCastlePosition"></Castle>
</template>

<script>
import Castle from "./Castle";

export default {
  name: "BuildCastle",
  components: { Castle },
  props: {
    mouseDownTimestamp: Number,
    dragging: Boolean,
    viewPosition: Object
  },
  data() {
    return {
      firstCastlePosition: { x: 200, y: 200 },
      waitingForAnimationFrame: false
    };
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
        this.firstCastlePosition.x = event.clientX;
        this.firstCastlePosition.y = event.clientY;
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
      await this.$store.dispatch("SET_CASTLE", position);
      await this.$store.dispatch("GET_CASTLES");
    }
  }
};
</script>
