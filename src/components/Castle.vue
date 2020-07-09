<template>
  <svg :x="position.x" :y="position.y">
    <svg x="7" y="0" class="flag-wrapper" width="25" height="25" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">

      <defs>
        <clipPath id="flagMask">
          <polygon id="mask" points="100,31 33.032,31 49.467,49.826 32.684,69 100,69 	"/>
        </clipPath>
      </defs>

      <!--<path id="bg" fill="#2E3E4F" d="M100,89.811C100,95.438,95.438,100,89.811,100H10.189C4.562,100,0,95.438,0,89.811V10.189
			C0,4.562,4.562,0,10.189,0h79.621C95.438,0,100,4.562,100,10.189V89.811z"/>-->

      <g clip-path="url(#flagMask)">
        <path class="flag" fill="#E94741" d="M100,31c-8.118,0-8.364,4.504-16.471,4.504
		c-7.657,0-8.026-4.504-16.47-4.504c-8.675,0-8.675,4.504-16.471,4.504c-8.091,0-8.091-4.504-16.471-4.504
		c-8.492,0-8.739,4.504-16.47,4.504C9.027,35.504,9.37,31,1.178,31c-8.734,0-8.589,4.504-16.471,4.504S-24.251,31-31.763,31v34.438
		c0,0,7.849,3.66,16.47,3.66c7.914,0,8.653-3.66,16.471-3.66c7.822,0,7.357,3.66,16.47,3.66s9.12-3.66,16.47-3.66
		c8.01,0,8.133,3.66,16.471,3.66c7.276,0,7.549-3.66,16.471-3.66c8.689,0,8.936,3.66,16.47,3.66c8.497,0,8.333-3.66,16.471-3.66V31z
		"/>
      </g>

    </svg>
<!--    <line :x1="position.x" :y1="position.y" :x2="position.x" :y2="position.y" class="circle"></line>-->

    <svg x="0" y="7" width="64" height="83" viewBox="0 0 64 83" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="31.5" y1="25" x2="31.5" stroke="#95938F"/>
      <path d="M18.4789 34.9623V83H45.1268V34.9623L53 27.3774V21.6887V16H47.5493V21.6887H41.493V16H34.831V21.6887H28.169V16H21.507V21.6887H15.1479V16H10V27.3774L18.4789 34.9623Z" fill="#414B4D"/>
      <line y1="82.5" x2="64" y2="82.5" stroke="#94962E"/>
<!--      <path d="M46 1H31V9H46L42.3333 5.23529L46 1Z" fill="#E64940"/>-->
    </svg>
  </svg>
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
</style>
