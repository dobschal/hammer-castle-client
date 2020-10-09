<template>
    <!--    <svg :x="position.x - 51" :y="position.y - 40" width="80" height="80" viewBox="0 0 577 826" fill="none" xmlns="http://www.w3.org/2000/svg">-->
    <!--&lt;!&ndash;        <image href="../assets/warehouse.png" height="577" width="826" x="0" y="0"/>&ndash;&gt;-->
    <!--        -->
    <!--    </svg>-->
    <svg :x="position.x - 25" :y="position.y - 41"
         width="50"
         height="60"
         viewBox="0 0 199 248"
         @click="$emit('CLICK', warehouse)"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         @mouseover="highlighted = true"
         @mouseout="highlighted = false">
        <ellipse cx="99.4627"
                 cy="176.465"
                 rx="89.2065"
                 ry="50.5694"
                 transform="rotate(-14.6334 99.4627 176.465)"
                 fill="#6E4E37"
                 opacity="0.1"
                 stroke="#6E4E37"
                 stroke-width="30"/>
        <path d="M37.3463 67.5L41.3463 192.5L85.8463 215.5L95.8463 90.5L37.3463 67.5Z" fill="#DCA56E"/>
        <path d="M156.141 180.5L85.6413 215.5L95.6413 91L169.346 58L156.141 180.5Z" fill="#B68759"/>
        <path d="M64.3463 33.5L36.3463 68L95.8463 90.5L64.3463 33.5Z" fill="#DCA56E"/>
        <path d="M96.3465 90L37.8465 67" stroke="#522106" stroke-width="3"/>
        <path d="M83.8464 65.5L48.6134 53.5" stroke="#522106" stroke-width="3"/>
        <path d="M83.8464 66L62.3464 76.6624" stroke="#522106" stroke-width="3"/>
        <path d="M74.8464 49.5L63.8807 57.1625" stroke="#522106" stroke-width="3"/>
        <path d="M76.8465 70L80.3464 83M92.8465 71L96.3464 84" stroke="#522106" stroke-width="3"/>
        <path d="M54.8463 45L63.3463 57" stroke="#522106" stroke-width="3"/>
        <path d="M52.8463 62.5L43.8463 69" stroke="#522106" stroke-width="3"/>
        <path d="M48.3463 53.5L61.7017 76.0966" stroke="#522106" stroke-width="3"/>
        <path d="M64.0291 34.4952L63.5288 77.5316" stroke="#522106" stroke-width="3"/>
        <path d="M64.1412 33.5L32.6411 73" stroke="#B83422" stroke-width="2"/>
        <path d="M63.8464 33L98.3464 95.5L173.346 67.5L139.846 0L63.8464 33Z" fill="#B83422"/>
        <path d="M53.1411 168L54.6411 199.5L70.1411 207.5L72.1411 177.5C63.1411 150 53.1411 168 53.1411 168Z"
              fill="#522106" stroke="#311303"/>
        <path d="M59.6411 113.322L60.5095 131.407L69.1411 134.5L70.6411 118.776C65.4305 102.987 59.6411 113.322 59.6411 113.322Z"
              fill="#522106" stroke="#311303"/>
        <line x1="58.1411" y1="168" x2="58.1411" y2="201" stroke="#311303"/>
        <line x1="63.1408" y1="170.015" x2="62.1408" y2="203.015" stroke="#311303"/>
        <line x1="68.14" y1="174.032" x2="66.14" y2="205.032" stroke="#311303"/>
        <path d="M54.1411 183.5L71.1411 189" stroke="#311303" stroke-width="3"/>

        <!-- Box -->
        <g class="box" :class="{ 'animate': highlighted && !dragging && !pageOverlayOpen }">
            <path d="M62.141 141.5L50.641 136V144.5L62.141 150V141.5Z" fill="#B06326" stroke="#854A1B"/>
            <path d="M55.141 147.5L43.641 142V150.5L55.141 156V147.5Z" fill="#B06326" stroke="#854A1B"/>
            <path d="M61.641 141.5L55.141 148L43.641 141.5L50.141 136L61.641 141.5Z" fill="#B06326" stroke="#854A1B"/>
            <path d="M62.141 150L55.641 156L55.141 148L62.141 142V150Z" fill="#B06326" stroke="#854A1B"/>
            <line x1="46.8839" y1="139.563" x2="55.8839" y2="144.563" stroke="#854A1B"/>
            <line x1="52.3209" y1="145.616" x2="58.3209" y2="140.616" stroke="#854A1B"/>
            <line x1="46.141" y1="151" x2="46.141" y2="144" stroke="#854A1B"/>
            <line x1="49.141" y1="152" x2="49.141" y2="145" stroke="#854A1B"/>
            <line x1="52.141" y1="154" x2="52.141" y2="147" stroke="#854A1B"/>
            <line x1="54.4016" y1="151.439" x2="43.4016" y2="145.439" stroke="#854A1B"/>
            <line x1="61.9611" y1="147.384" x2="55.9611" y2="152.384" stroke="#854A1B"/>
            <line x1="61.9611" y1="145.384" x2="55.9611" y2="150.384" stroke="#854A1B"/>
            <line x1="58.141" y1="153" x2="58.141" y2="146" stroke="#854A1B"/>
            <line x1="60.141" y1="151" x2="60.141" y2="144" stroke="#854A1B"/>
            <line x1="49.3209" y1="143.616" x2="55.3209" y2="138.616" stroke="#854A1B"/>
            <line x1="46.3209" y1="142.616" x2="52.3209" y2="137.616" stroke="#854A1B"/>
            <line x1="48.8839" y1="137.563" x2="57.8839" y2="142.563" stroke="#854A1B"/>
        </g>
        <!-- line to box -->
        <line x1="52.1411" y1="105" x2="52.1411" y2="142" stroke="black" class="line-to-box" :class="{ 'animate': highlighted && !dragging && !pageOverlayOpen }"/>


        <line x1="124.14" y1="122.969" x2="125.14" y2="138.969" stroke="black"/>
        <line x1="139.138" y1="117.055" x2="137.138" y2="135.055" stroke="black"/>
        <path d="M129.141 160.5C129.141 160.5 122.641 149.5 122.641 137L131.641 129L140.141 130C140.141 144.5 129.141 160.5 129.141 160.5Z"
              :fill="color" stroke="#311303"/>
        <path d="M116.641 125.5L147.641 113" stroke="#361705" stroke-width="3"/>
        <path d="M115.641 125.5L146.641 113" stroke="#522106" stroke-width="3"/>
        <path d="M49.1103 109.252L66.9703 99.9663L67.5712 96.0499L49.8313 104.552L49.1103 109.252Z" fill="#522106"
              stroke="#311303"/>
        <path d="M49.8914 104.161L67.2997 95.2065L63.6236 93.0391L45.8838 101.541L49.8914 104.161Z" fill="#522106"
              stroke="#311303"/>
        <path d="M48.6585 109.584L49.4998 104.101L45.432 101.873L45.0425 107.025L48.6585 109.584Z" fill="#522106"
              stroke="#311303"/>
        <path d="M91.0699 206.649L114 196.391M91.0699 201.192L108.391 193.347" stroke="#A0774E"/>
        <path d="M92.0561 194.655L107.648 187.68M91.4051 189.489L103.171 184.13" stroke="#A0774E"/>
        <line x1="92.7253" y1="208.964" x2="94.5356" y2="184.223" stroke="#A3784D"/>
        <line x1="96.3464" y1="207.146" x2="98.1567" y2="186.629" stroke="#A3784D"/>
        <line x1="99.9664" y1="206.549" x2="101.173" y2="190.257" stroke="#A3784D"/>
        <line x1="102.987" y1="204.102" x2="104.194" y2="195.654" stroke="#A3784D"/>
        <path d="M110.5 61.7667L105.733 54.8L105 36.8333L110.5 38.3V61.7667Z" fill="#9D754D" stroke="#725232"/>
        <path d="M116 36.8333L110.5 38.3L110.867 62.5L116 59.5667V36.8333Z" fill="#A4794E" stroke="#7B5C3C"/>
        <path d="M109.4 35L105.367 36.4667L110.5 37.9333L115.267 36.4667L109.4 35Z" fill="#383838" stroke="#73502E"/>

        <!-- Circle with Level -->
        <circle cx="170" cy="30" r="28" fill="rgba(0,0,0,0.5)" stroke="none"/>
        <text :x="170" :y="47" class="name" v-if="warehouse" text-anchor="middle">{{ warehouse.level }}</text>
    </svg>

</template>

<script>
    export default {
        name: "Warehouse",
        props: {
            color: String,
            dragging: Boolean,
            pageOverlayOpen: Boolean,
            warehouse: Object,
            position: {
                type: Object,
                validator: value => {
                    return typeof value.x === "number" && typeof value.y === "number";
                }
            }
        },
        data() {
            return {
                highlighted: false,
                boxPosition: {
                    x: 0,
                    y: 50
                }
            };
        }
    };
</script>

<style lang="scss" scoped>

    @keyframes move_box {
        0% {
            transform: translateY(0px);
        }
        10% {
            transform: translateY(0px);
        }
        20% {
            transform: translateY(60px);
        }
        50% {
            transform: translateY(60px);
        }
        100% {
            transform: translateY(0px);
        }

    }

    @keyframes move_line_box {
        0% {
            transform: scale(1, 1) translateY(0px);
        }
        10% {
            transform: scale(1, 1) translateY(0px);
        }
        20% {
            transform: scale(1, 2.5) translateY(10px);
        }
        50% {
            transform: scale(1, 2.5) translateY(10px);
        }
        100% {
            transform: scale(1, 1) translateY(0px);
        }

    }

    .box.animate {
        path, line {
            animation: move_box;
            animation-duration: 3s;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            will-change: transform;
        }
    }

    .line-to-box.animate {
        transform-origin: 50% 50%;
        animation: move_line_box;
        animation-duration: 3s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        will-change: transform;
    }

    .name {
        font: 50px 'MedievalSharp';
        letter-spacing: 0.5px;
        fill: white;
        font-weight: bold;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
        /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
    }
</style>
