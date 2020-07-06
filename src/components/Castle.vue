<template>
  <line :x1="position.x" :y1="position.y" :x2="position.x" :y2="position.y" class="circle"></line>
</template>

<script>
export default {
  name: "Castle",
  props: {
    position: {
      type: Object,
      validator: value => {
        return typeof value.x === "number" && typeof value.y === "number";
      }
    }
  }
};
</script>


<style scoped>
.circle {
  stroke: green;
  stroke-width: 30;
  stroke-linecap: round;
  transition: stroke-width 0.3s ease-out;
}

.circle:hover {
  stroke-width: 50;
  cursor: pointer;
}
</style>
