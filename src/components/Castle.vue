<template>
    <svg :x="position.x - 125" :y="position.y - 125" @click="$emit('CLICK', castle)" @mouseover="highlighted = true"
         @mouseout="highlighted = false">

        <circle cx="125" cy="125" r="35" :fill="actionAction === 'BUILD_CASTLE' ? '#c6cc71' : 'rgb(181,230,123)'" stroke="none"/>
        <!--      <circle cx="125" cy="125" r="200" fill="rgba(181,230,123, 0.5)"  stroke-width="3" :stroke="color"/>-->

        <CastleLevel1 v-if="!castle || points <= 1"></CastleLevel1>
        <CastleLevel2 v-else-if="points === 2"></CastleLevel2>
        <CastleLevel3 v-else-if="points === 3"></CastleLevel3>
        <CastleLevel4 v-else-if="points === 4"></CastleLevel4>
        <CastleLevel5 v-else></CastleLevel5>

        <svg v-for="flagPos in flagPositions"
             :key="flagPos.x + '' + flagPos.y" :x="flagPos.x" :y="flagPos.y"
             class="flag-wrapper"
             width="35"
             height="35"
             viewBox="0 0 100 100"
             fill="none"
             xmlns="http://www.w3.org/2000/svg">

            <g clip-path="url(#flagMaskCastle)">
                <path class="flag"
                      :class="{ animated: !dragging }"
                      :fill="color"
                      d="M100,31c-8.118,0-8.364,4.504-16.471,4.504
		c-7.657,0-8.026-4.504-16.47-4.504c-8.675,0-8.675,4.504-16.471,4.504c-8.091,0-8.091-4.504-16.471-4.504
		c-8.492,0-8.739,4.504-16.47,4.504C9.027,35.504,9.37,31,1.178,31c-8.734,0-8.589,4.504-16.471,4.504S-24.251,31-31.763,31v34.438
		c0,0,7.849,3.66,16.47,3.66c7.914,0,8.653-3.66,16.471-3.66c7.822,0,7.357,3.66,16.47,3.66s9.12-3.66,16.47-3.66
		c8.01,0,8.133,3.66,16.471,3.66c7.276,0,7.549-3.66,16.471-3.66c8.689,0,8.936,3.66,16.47,3.66c8.497,0,8.333-3.66,16.471-3.66V31z
		"/>
            </g>

        </svg>

        <!-- Shield with level number -->
        <g v-tooltip="'This number describes the amount of roads attached to the castle by the castles owner.'">
            <svg :x="145" :y="45" width="30" height="30" viewBox="0 0 48 58" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M1 13.4583C1 32.25 14.8 57 24 57C33.2 57 47 32.25 47 13.4583C47 13.4583 33.2 13.9167 24.92 2C14.8 13.9167 1 13.4583 1 13.4583Z"
                      fill="#564942" stroke-opacity="0.5" :stroke="highlighted ? color : '#C0C0C0'"
                      :stroke-width="highlighted ? 5 : 3"/>
            </svg>
            <text :x="160" :y="67" class="points" :fill="highlighted ? 'white' : '#E0E0E0'" v-if="castle"
                  text-anchor="middle">{{ points }}
            </text>
        </g>

        <!-- Banner below -->
        <svg class="banner" :x="55" :y="120" width="140" height="50" viewBox="0 0 232 80" fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <path d="M193.906 64.2131C144.676 68.2131 79.3708 69.7131 35.6666 64.2131C39.2835 58.6131 37.676 42.7131 36.6713 34.7131C106.498 46.7131 179.338 37.2131 193.906 34.7131C191.093 42.3131 192.734 57.7131 193.906 64.2131Z"
                  :fill="color"/>
            <path d="M192.901 52.9088C211.79 55.3088 222.54 49.9088 225.554 46.9088L214 44.4088L202.446 38.4088L211.488 34.9088L218.019 29.4088C220.53 25.5755 225.755 17.5088 226.559 15.9088C227.362 14.3088 212.158 22.9088 204.455 27.4088H196.418L171.803 26.4088V27.4088L194.408 34.9088L192.901 52.9088Z"
                  :fill="color"/>
            <path d="M21.0986 52.7131L7.03282 48.2131V47.2131L14.568 45.2131L28.1314 38.2131L19.5915 34.2131C16.9123 32.0464 11.4535 27.4131 11.0516 26.2131C10.6497 25.0131 6.19558 18.0464 4.01874 14.7131C8.20497 17.7131 16.7784 23.8131 17.5821 24.2131C18.3859 24.6131 27.6291 26.7131 32.1502 27.7131L58.7746 26.2131L60.2817 27.7131L36.6713 35.2131L38.1784 42.2131V52.7131C38.1784 53.9131 32.4851 53.8798 29.6385 53.7131L21.0986 52.7131Z"
                  :fill="color"/>
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M34.3459 65.4091C34.3459 62.1675 36.8471 57.2496 36.8471 54.008C22.455 55.272 9.60057 54.0774 0.69978 45.16C8.20369 45.9814 14.4332 45.016 25.8448 38.1147C13.2964 35.8854 6.92664 21.5067 0 11C25.7859 29.6667 37.8941 26.9467 61.5304 24.92C61.5304 28.354 58.8687 32.3563 61.7313 36.6464C77.5657 39.4042 93.3108 38.1169 107 38.1276C122.55 37.6599 155.82 39.3834 169.291 36.6283C171.249 33.4112 169.57 28.3446 169.492 24.9019C193.127 26.9389 205.236 29.6644 231.022 11C224.096 21.4896 217.726 35.8789 205.178 38.1093C216.589 45.0069 222.819 45.9739 230.323 45.1531C221.422 54.0683 208.567 55.2624 194.175 54.0032C194.175 57.2448 196.676 62.1627 196.676 65.4043C168.227 70.6949 128.295 68.8784 107.206 68.7131C75.5017 68.0624 53.1446 70.4625 34.3447 65.4119L34.3459 65.4091ZM190.33 62.5951C187.316 47.9226 189.949 46.0186 192.735 35.5322C168.423 39.0801 165.272 41.7131 107.206 41.7131C60.2816 41.7131 57.8799 39.7629 38.2845 35.5504C41.0704 46.0368 42.6995 54.0215 37.879 62.6134C52.2441 66.7131 107.206 65.4091 107.206 65.4091C107.206 65.4091 180.785 67.7357 190.33 62.5951ZM28.3164 52.2731C33.0515 52.2375 36.0595 51.0658 37.259 51.3357C37.259 44.0792 35.4969 41.0456 35.4969 33.7885C43.3689 31.33 49.209 27.9795 57.4266 27.0382C37.7675 27.3395 30.8066 36.1683 7.63894 19.0819C16.6617 31.8877 24.4369 37.7982 32.9418 37.5267C27.2718 39.9497 23.3813 46.8222 11.798 47.9406C18.6139 51.4492 24.1381 52.3045 28.3164 52.2731ZM202.701 52.2549C206.879 52.2862 212.404 51.4312 219.22 47.9226C207.636 46.8044 203.746 39.9317 198.076 37.5088C206.581 37.7803 214.356 31.8698 223.379 19.064C200.211 36.1504 193.25 27.3216 173.591 27.0202C181.809 27.9617 187.649 31.3123 195.521 33.7706C195.521 41.0272 193.759 44.0608 193.759 51.3178C194.958 51.0479 197.966 52.2192 202.701 52.2549Z"
                  :fill="$util.shadeColor(color, 0.5)"/>
        </svg>
        <text :x="124" :y="157" class="name" v-if="castle" text-anchor="middle">{{ castle.name || "Burg" }}</text>

        <svg v-if="castle && castle.isInConquer" class="sword1" x="55" y="30" width="100" height="56"
             viewBox="0 0 20 56" fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <path d="M11.6667 55V46.5H7.66667V55C7.66667 55 9.66667 56.5 11.6667 55Z" fill="#90471F"/>
            <path d="M5.66667 7V43H13.6667V7L9.66667 0L5.66667 7Z" fill="#C4C4C4"/>
            <rect x="9.16669" y="8" width="1" height="36" rx="0.5" fill="#A0A0A0"/>
            <path d="M18.6667 43H13.6667H5.66667H0.666667C-0.833333 44.5 0.666667 46 0.666667 46C0.666667 46 4.66669 45.5 5.66667 46C6.66665 46.5 7.66667 46.5 7.66667 46.5H11.6667C11.6667 46.5 12.6666 46.5 13.6667 46C14.6667 45.5 18.6667 46 18.6667 46C18.6667 46 20.1667 44.5 18.6667 43Z"
                  fill="#515151"/>
        </svg>

        <svg v-if="castle && castle.isInConquer" class="sword2" x="95" y="30" width="100" height="56"
             viewBox="0 0 20 56" fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <path d="M11.6667 55V46.5H7.66667V55C7.66667 55 9.66667 56.5 11.6667 55Z" fill="#90471F"/>
            <path d="M5.66667 7V43H13.6667V7L9.66667 0L5.66667 7Z" fill="#C4C4C4"/>
            <rect x="9.16669" y="8" width="1" height="36" rx="0.5" fill="#A0A0A0"/>
            <path d="M18.6667 43H13.6667H5.66667H0.666667C-0.833333 44.5 0.666667 46 0.666667 46C0.666667 46 4.66669 45.5 5.66667 46C6.66665 46.5 7.66667 46.5 7.66667 46.5H11.6667C11.6667 46.5 12.6666 46.5 13.6667 46C14.6667 45.5 18.6667 46 18.6667 46C18.6667 46 20.1667 44.5 18.6667 43Z"
                  fill="#515151"/>
        </svg>

        <text v-if="countDown && castle && castle.isInConquer" x="125" y="65" class="count-down" fill="black"
              text-anchor="middle">{{ countDown }}
        </text>

    </svg>
</template>

<script>
    import config from "../config";
    import CastleLevel1 from "./castles/level1";
    import CastleLevel2 from "./castles/level2";
    import CastleLevel3 from "./castles/level3";
    import CastleLevel4 from "./castles/level4";
    import CastleLevel5 from "./castles/level5";

    export default {
        name: "Castle",
        components: {CastleLevel1, CastleLevel2, CastleLevel3, CastleLevel4, CastleLevel5},
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
            },
            dragging: Boolean,
            actionAction: String
        },
        computed: {
            points() {
                return this.castle && typeof this.castle.points === "number" ? this.castle.points : 0;
            },
            flagPositions() {
                if (this.points === "?") return [{x: 91, y: 54}];
                switch (this.points) {
                    case 0:
                    case 1:
                        return [{x: 91, y: 66}];
                    case 2:
                        return [{x: 90, y: 55}];
                    case 3:
                        return [{x: 70, y: 49}];
                    case 4:
                        return [{x: 66, y: 50}, {x: 110, y: 60}];
                    case 5:
                        return [{x: 45, y: 59}, {x: 90, y: 69}, {x: 91, y: 53}, {x: 132, y: 62}];
                    default:
                        return [{x: 64, y: 39}, {x: 116, y: 50}];
                }
            }
        },
        data() {
            return {
                highlighted: false,
                radius: config.MIN_CASTLE_DISTANCE,
                countDown: undefined,
                intervalId: undefined
            }
        },
        watch: {
            highlighted(val) {
                if (val) {
                    this.$emit("HIGHLIGHT-ON", this.castle);
                } else {
                    this.$emit("HIGHLIGHT-OFF", this.castle);
                }
            },
            "castle.isInConquer"(val) {
                if (val) {
                    this.initCountDown();
                }
            }
        },
        created() {
            if (this.castle && this.castle.isInConquer) {
                this.initCountDown();
            }
        },
        beforeDestroy() {
            if (this.intervalId) clearInterval(this.intervalId);
        },
        methods: {
            initCountDown() {
                this.intervalId = setInterval(() => {
                    let seconds = Math.max(0, Math.floor((this.castle.attackHappensAt - Date.now()) / 1000));
                    const minutes = Math.floor(seconds / 60) || 0;
                    seconds = seconds % 60;
                    this.countDown = `${minutes < 10 ? ('0' + minutes) : minutes}:${seconds < 10 ? ('0' + seconds) : seconds}`;
                }, 1000);
            }
        }
    };
</script>


<style scoped lang="scss">
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

        &.animated {
            animation: move_flag;
            animation-duration: 1s;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
        }
    }

    .points {
        font: 20px 'MedievalSharp';
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
        /* Non-prefixed version, currently
                                         supported by Chrome, Edge, Opera and Firefox */

    }

    .name {
        font: 12px 'MedievalSharp';
        letter-spacing: 0.5px;
        fill: white;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
        /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
    }

    /*.username {*/
    /*  font: 12px 'MedievalSharp';*/
    /*  letter-spacing: 0;*/
    /*  fill: white;*/
    /*  -webkit-touch-callout: none; !* iOS Safari *!*/
    /*  -webkit-user-select: none; !* Safari *!*/
    /*  -khtml-user-select: none; !* Konqueror HTML *!*/
    /*  -moz-user-select: none; !* Old versions of Firefox *!*/
    /*  -ms-user-select: none; !* Internet Explorer/Edge *!*/
    /*  user-select: none;*/
    /*}*/

    /*.username-bg {*/
    /*  font: 12px 'MedievalSharp';*/
    /*  letter-spacing: 0;*/
    /*  fill: black;*/
    /*  -webkit-touch-callout: none; !* iOS Safari *!*/
    /*  -webkit-user-select: none; !* Safari *!*/
    /*  -khtml-user-select: none; !* Konqueror HTML *!*/
    /*  -moz-user-select: none; !* Old versions of Firefox *!*/
    /*  -ms-user-select: none; !* Internet Explorer/Edge *!*/
    /*  user-select: none;*/
    /*}*/

    @keyframes rotate_sword {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(45deg);
        }
        100% {
            transform: rotate(0deg);
        }
    }

    @keyframes rotate_sword2 {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(-45deg);
        }
        100% {
            transform: rotate(0deg);
        }
    }

    .sword1 {
        * {
            transform: rotate(45deg);
            transform-origin: 50% 90%;
            animation: rotate_sword;
            animation-iteration-count: infinite;
            animation-duration: 1s;
        }
    }

    .sword2 {
        * {
            transform: rotate(-45deg);
            transform-origin: 50% 90%;
            animation: rotate_sword2;
            animation-iteration-count: infinite;
            animation-duration: 1s;
        }
    }

    .count-down {
        font: 12px 'MedievalSharp';
        font-weight: bold;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
    }
</style>
