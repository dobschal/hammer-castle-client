<template>
  <svg>
    <svg :x="position.x - 32" :y="position.y - 75" @mouseover="showTooltip" @mouseout="hideTooltip">

      <svg x="7" y="0" class="flag-wrapper" width="25" height="25" viewBox="0 0 100 100" fill="none"
           xmlns="http://www.w3.org/2000/svg">

        <defs>
          <clipPath id="flagMask">
            <polygon id="mask" points="100,31 33.032,31 49.467,49.826 32.684,69 100,69 	"/>
          </clipPath>
        </defs>

        <g clip-path="url(#flagMask)">
          <path class="flag" :fill="color" d="M100,31c-8.118,0-8.364,4.504-16.471,4.504
		c-7.657,0-8.026-4.504-16.47-4.504c-8.675,0-8.675,4.504-16.471,4.504c-8.091,0-8.091-4.504-16.471-4.504
		c-8.492,0-8.739,4.504-16.47,4.504C9.027,35.504,9.37,31,1.178,31c-8.734,0-8.589,4.504-16.471,4.504S-24.251,31-31.763,31v34.438
		c0,0,7.849,3.66,16.47,3.66c7.914,0,8.653-3.66,16.471-3.66c7.822,0,7.357,3.66,16.47,3.66s9.12-3.66,16.47-3.66
		c8.01,0,8.133,3.66,16.471,3.66c7.276,0,7.549-3.66,16.471-3.66c8.689,0,8.936,3.66,16.47,3.66c8.497,0,8.333-3.66,16.471-3.66V31z
		"/>
        </g>

      </svg>

      <!-- old 2D castle
      <svg x="0" y="7" width="64" height="83" viewBox="0 0 64 83" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="31.5" y1="25" x2="31.5" stroke="#95938F"/>
        <path d="M18.4789 34.9623V83H45.1268V34.9623L53 27.3774V21.6887V16H47.5493V21.6887H41.493V16H34.831V21.6887H28.169V16H21.507V21.6887H15.1479V16H10V27.3774L18.4789 34.9623Z"
              fill="#414B4D"/>
        <line y1="82.5" x2="64" y2="82.5" stroke="#94962E"/>
      </svg>-->

      <svg x="0" y="7" width="64" height="83" viewBox="0 0 110 169" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M101 49L109.5 52.5V66L55.5 43.5V31L64 35V40L72 43.5V38L79 41V46L86.5 49V43.5L93 46V51.5L101 54.5V49Z" fill="#C4C4C4" stroke="black" stroke-opacity="0.42"/>
        <path d="M2 66.5L55.5 44C73.3333 51.5 109.1 66.5 109.5 66.5C110 66.5 56.5 88.5 55.5 88.5C54.7 88.5 19.8333 73.8333 2 66.5Z" fill="#959595"/>
        <path d="M10 49L1.5 52.5V66L55.5 43.5V31L47 35V40L39 43.5V38L32 41V46L24.5 49V43.5L18 46V51.5L10 54.5V49Z" fill="#6C6C6C" stroke="black" stroke-opacity="0.42"/>
        <path d="M55 86V167.5L13.5 146.5L8.5 75.5L1 66.5V53L8.5 56V62.5L17 66V60L23.5 62.5V68.5L32 72V66L38.5 69V74.5L47.5 78V72.5L55 75.5V86Z" fill="#C4C4C4" stroke="black" stroke-opacity="0.42"/>
        <path d="M55.5 86V167.5L97 146.5L102 75.5L109.5 66.5V53L102 56V62.5L93.5 66V60L87 62.5V68.5L78.5 72V66L72 69V74.5L63 78V72.5L55.5 75.5V86Z" fill="#6C6C6C" stroke="black" stroke-opacity="0.42"/>
        <path d="M55.5 75.5V88.5L109.5 66.5V53L102 56V62.5L93.5 66V60L87 62.5V68.5L78.5 72V66L72 69V74.5L63 78V72.5L55.5 75.5Z" fill="#6C6C6C" stroke="black" stroke-opacity="0.42"/>
        <path d="M55 75.5V88.5L1 66.5V53L8.5 56V62.5L17 66V60L23.5 62.5V68.5L32 72V66L38.5 69V74.5L47.5 78V72.5L55 75.5Z" fill="#C4C4C4" stroke="black" stroke-opacity="0.42"/>
        <path d="M8.5 75.5L1 67L55 88.5V94.5L8.5 75.5Z" fill="#BABABA" stroke="black" stroke-opacity="0.42"/>
        <path d="M102 75.5L109.5 67L55.5 88.5V94.5L102 75.5Z" fill="#4F4F4F" stroke="black" stroke-opacity="0.42"/>
        <path d="M55 0H57L56.5 61H55.5L55 0Z" fill="#494949"/>
      </svg>


    </svg>

    <circle :cx="position.x + 22" :cy="position.y + 7" :r="20" :fill="color" opacity="1"/>
    <text :x="position.x + 12" :y="position.y + 18" class="points" v-if="castle">{{ points }}</text>
  </svg>
</template>

<script>
  import config from "../config";

  export default {
    name: "Castle",
    props: {
      color: String,
      castle: {
        type: Object,
        default: undefined
      },
      position: {
        type: Object,
        validator: value => {
          return typeof value.x === "number" && typeof value.y === "number";
        }
      }
    },
    computed: {
      points() {
        return typeof this.castle.points === "number" ? this.castle.points : "?";
      }
    },
    data() {
      return {
        radius: config.MIN_CASTLE_DISTANCE
      }
    },
    methods: {
      showTooltip() {
        if (this.castle) {
          console.log("[Castle] Hover: ", this.castle);
        }
      },
      hideTooltip() {
        console.log("Out");
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

@keyframes move_flag {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(35px);
  }
}

.flag {
  animation: move_flag;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.points {
  font: 33px 'MedievalSharp';
  fill: white;
}
</style>
