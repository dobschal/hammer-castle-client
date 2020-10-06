<template>
    <svg :x="position.x - 40" :y="position.y - 75" v-tooltip="'Chance to win is ' + catapult.chance_to_win + '%'">
        <svg width="75" height="120" viewBox="0 0 197 186" fill="none"
             xmlns="http://www.w3.org/2000/svg">

            <!-- ARROW -->
            <svg :height="56" :width="88" x="125" y="10" viewBox="0 0 32 46" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M10.4 19.4968L10.68 45H21.6V19.4968H30L16 1L2 19.4968H10.4Z"
                      :fill="color"
                      stroke="black"
                      class="arrow"
                      :style="{transform: 'rotate(' + angle + 'deg)', 'transform-origin': '50% 50%' }"/>
            </svg>

            <g filter="url(#catapult_filter0_d)">
                <ellipse cx="166.5" cy="127.5" rx="8.5" ry="12.5" transform="rotate(-16.5175 166.5 127.5)"
                         fill="#5B4B4B"/>
            </g>
            <ellipse cx="165.482" cy="127.394" rx="2" ry="3.10886" transform="rotate(-9.4141 165.482 127.394)"
                     fill="#C4C4C4"/>
            <g filter="url(#catapult_filter1_d)">
                <ellipse cx="107.5" cy="105.92" rx="7.6262" ry="11.215" transform="rotate(-16.5175 107.5 105.92)"
                         fill="#5B4B4B"/>
            </g>
            <ellipse cx="106.586" cy="105.825" rx="1.7944" ry="2.78927" transform="rotate(-9.4141 106.586 105.825)"
                     fill="#C4C4C4"/>
            <path d="M195 127L124 171L20 133.5L89 92.9998L195 127Z" fill="#90471F"/>
            <path d="M195 127L124 171L20 133.5L89 92.9998L195 127Z" fill="url(#catapult_paint0_linear)"
                  fill-opacity="0.2"/>
            <path d="M195 127L124 171L20 133.5L89 92.9998L195 127Z" stroke="black"/>
            <path d="M195.5 138V127.5L124 171.5V183.5L195.5 138Z" fill="#4F250F" stroke="black"/>
            <path d="M21.5 146L124 184V170.5L19.5 134L21.5 146Z" fill="#B96232" stroke="black"/>
            <line x1="118.741" y1="158.572" x2="161.741" y2="132.572" stroke="#653216"/>
            <line x1="125.748" y1="141.568" x2="161.748" y2="120.568" stroke="#653216"/>
            <line x1="106.741" y1="158.572" x2="149.741" y2="132.572" stroke="#653216"/>
            <line x1="37.7" y1="132.6" x2="69.7" y2="108.6" stroke="#653216"/>
            <line x1="52.7316" y1="139.578" x2="63.7316" y2="132.578" stroke="#653216"/>
            <line x1="46.7145" y1="136.59" x2="69.7145" y2="120.59" stroke="#653216"/>

            <!-- Shield on back side -->
            <path d="M139.195 84C139.195 84 148 77.614 148 63.9298C142.439 62.1053 138.732 58 138.732 58C138.732 58 132.707 60.2807 129 58.9123C129 70.7719 139.195 84 139.195 84Z"
                  :fill="color" stroke="black"/>

            <path d="M140.444 114.383V46.9442L144 45.6109L143.111 113.166L140.444 114.383Z" fill="#4F250F"
                  stroke="black"/>
            <path d="M140.444 114.5L132 111.389V44.2775L140.444 46.9442V114.5Z" fill="#B96232" stroke="black"/>
            <path d="M135.111 42.9442L132.889 43.8331L140.444 46.9442L143.556 45.1664L135.111 42.9442Z" fill="#90471F"
                  stroke="black"/>
            <path d="M81.5 114L137 76.4998C139 77.4998 137.5 79.9998 137.5 79.9998L81.5 118V114Z" fill="#717171"/>
            <path d="M81.5 114L137 76.4998C139 77.4998 137.5 79.9998 137.5 79.9998L81.5 118V114Z"
                  fill="url(#catapult_paint1_linear)"/>

            <!-- Pitcher -->
            <g class="pitcher">
                <path d="M145.149 117.869L148.795 115.374L29.6439 44.1617L27.3191 46.9649L145.149 117.869Z"
                      fill="#AD6D23"
                      stroke="black"/>
                <path d="M37.7532 49.9433C37.7532 49.9433 142.565 112.386 147.056 114.328C151.548 116.269 148.719 113.898 151.52 112.73C154.321 111.562 42.5246 47.8227 42.5246 47.8227C42.5246 47.8227 46.2212 41.547 35.2387 35.0778C24.2561 28.6086 19.3343 25.0052 12.5929 28.0784C5.85145 31.1517 -3.71995 31.8539 11.9695 41.0956C27.659 50.3373 37.7532 49.9433 37.7532 49.9433Z"
                      fill="#D18227" stroke="black"/>
                <path d="M9.72449 33.951L18.8866 30.5097C18.8866 30.5097 43.2388 42.0308 36.1735 44.8455C29.1082 47.6601 9.72449 33.951 9.72449 33.951Z"
                      fill="#9F621B" stroke="black"/>
            </g>
            <path d="M82 113.5L110.5 94.5C112.5 95.5 113.5 96.5 113.5 96.5L82 117.5V113.5Z" fill="#717171"/>
            <path d="M82 113.5L110.5 94.5C112.5 95.5 113.5 96.5 113.5 96.5L82 117.5V113.5Z"
                  fill="url(#catapult_paint2_linear)"/>
            <path d="M84 155.869V79.9998L88 78.4998L87 154.5L84 155.869Z" fill="#4F250F" stroke="black"/>
            <path d="M84 156L74.5 152.5V76.9998L84 79.9998V156Z" fill="#B96232" stroke="black"/>
            <path d="M78 75.4998L75.5 76.4998L84 79.9998L87.5 77.9998L78 75.4998Z" fill="#90471F" stroke="black"/>
            <path d="M107 164L84 121.5L87.5 118.5L111.5 160.5L107 164Z" fill="#632F13" stroke="black"/>
            <path d="M84 126V122L107 164.5L103.5 163L84 126Z" fill="#B96232" stroke="black"/>
            <path d="M162.25 121.038L141 81.7717L144.234 79L166.408 117.804L162.25 121.038Z" fill="#632F13"
                  stroke="black"/>
            <path d="M141 85.9293V82.2337L162.25 121.5L159.016 120.114L141 85.9293Z" fill="#B96232" stroke="black"/>
            <g filter="url(#catapult_filter2_d)">
                <ellipse cx="95.5" cy="171.5" rx="8.5" ry="12.5" transform="rotate(-16.5175 95.5 171.5)"
                         fill="#5B4B4B"/>
            </g>
            <ellipse cx="94.4816" cy="171.394" rx="2" ry="3.10886" transform="rotate(-9.4141 94.4816 171.394)"
                     fill="#C4C4C4"/>
            <g filter="url(#catapult_filter3_d)">
                <ellipse cx="36.5" cy="149.92" rx="7.6262" ry="11.215" transform="rotate(-16.5175 36.5 149.92)"
                         fill="#5B4B4B"/>
            </g>
            <ellipse cx="35.5863" cy="149.825" rx="1.7944" ry="2.78927" transform="rotate(-9.4141 35.5863 149.825)"
                     fill="#C4C4C4"/>

            <!-- Shield -->
            <path d="M79.1951 120C79.1951 120 88 113.614 88 99.9298C82.439 98.1053 78.7317 94 78.7317 94C78.7317 94 72.7073 96.2807 69 94.9123C69 106.772 79.1951 120 79.1951 120Z"
                  :fill="color"/>
            <path d="M79.1951 120C79.1951 120 88 113.614 88 99.9298C82.439 98.1053 78.7317 94 78.7317 94C78.7317 94 72.7073 96.2807 69 94.9123C69 106.772 79.1951 120 79.1951 120Z"
                  fill="url(#catapult_paint3_linear)" fill-opacity="0.4"/>
            <path d="M79.1951 120C79.1951 120 88 113.614 88 99.9298C82.439 98.1053 78.7317 94 78.7317 94C78.7317 94 72.7073 96.2807 69 94.9123C69 106.772 79.1951 120 79.1951 120Z"
                  stroke="black"/>
            <!-- Stone -->
            <g class="stone">
                <path d="M23 25.5V36L31.5 39.5L35 30.5L23 25.5Z" fill="#A5A5A5"/>
                <path d="M31.5 26.5L35 30.5L23 25.5L31.5 26.5Z" fill="#757575"/>
                <path d="M38 35L35 30.5L31.5 39.5L38 35Z" fill="#505050"/>
                <path d="M38 28.5L35 30.5L31 26.5L26 23L32 23.5L38 28.5Z" fill="#949494"/>
                <path d="M37 30.5L38 28.5L35 30.5L38 35L37 30.5Z" fill="#353535"/>
                <path d="M32 23.5L25.5 21.5L26 23L32 23.5Z" fill="#727272"/>
                <path d="M23 25.5L31 26.5L26 23L25.5 21.5L22 20.5L23 25.5Z" fill="#AEAEAE"/>
                <path d="M20 28.5L23 36V25.5L22 20.5L20 28.5Z" fill="#C4C4C4"/>
            </g>

            <defs>
                <filter id="catapult_filter0_d" x="154.797" y="111.599" width="26.4062" height="30.3016"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                    <feOffset dx="3" dy="-1.5"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.270833 0 0 0 0 0.220052 0 0 0 0 0.220052 0 0 0 1 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                </filter>
                <filter id="catapult_filter1_d" x="97" y="91.4998" width="24" height="27.3408"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                    <feOffset dx="3" dy="-1.5"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.270833 0 0 0 0 0.220052 0 0 0 0 0.220052 0 0 0 1 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                </filter>
                <filter id="catapult_filter2_d" x="83.7969" y="155.599" width="26.4062" height="30.3016"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                    <feOffset dx="3" dy="-1.5"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.270833 0 0 0 0 0.220052 0 0 0 0 0.220052 0 0 0 1 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                </filter>
                <filter id="catapult_filter3_d" x="26" y="135.5" width="24" height="27.3408"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                    <feOffset dx="3" dy="-1.5"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.270833 0 0 0 0 0.220052 0 0 0 0 0.220052 0 0 0 1 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                </filter>
                <linearGradient id="catapult_paint0_linear" x1="165.5" y1="145" x2="61.5" y2="107"
                                gradientUnits="userSpaceOnUse">
                    <stop/>
                    <stop offset="1" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="catapult_paint1_linear" x1="116.5" y1="96.9998" x2="113" y2="91.9998"
                                gradientUnits="userSpaceOnUse">
                    <stop/>
                    <stop offset="1" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="catapult_paint2_linear" x1="117" y1="96.5" x2="113.5" y2="91.5"
                                gradientUnits="userSpaceOnUse">
                    <stop/>
                    <stop offset="1" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="catapult_paint3_linear" x1="89" y1="112" x2="69" y2="97"
                                gradientUnits="userSpaceOnUse">
                    <stop/>
                    <stop offset="1" stop-opacity="0"/>
                </linearGradient>
            </defs>
        </svg>
        <text v-if="countDown" x="40" y="82" class="count-down" fill="white" text-anchor="middle">{{ countDown }}</text>
    </svg>

</template>

<script>

    import config from "../config";

    export default {
        name: "Catapult",
        props: {
            color: String,
            catapult: Object,
            position: {
                type: Object,
                validator: value => {
                    return typeof value.x === "number" && typeof value.y === "number";
                }
            }
        },
        data() {
            return {countDown: 0, intervalId: undefined, angle: 0};
        },
        created() {
            this.angle = Math.floor(Math.atan2(this.catapult.user_castle_y - this.catapult.opponent_castle_y, this.catapult.user_castle_x - this.catapult.opponent_castle_x) * 180 / Math.PI) - 82;
            console.log("[Catapult] Catapult: ", this.catapult, this.angle);
            this.intervalId = setInterval(() => {
                let seconds = Math.max(0, Math.floor(((Date.parse(this.catapult.timestamp.replace(" ", "T") + ".000Z") + config.CATAPULT_LIFETIME) - Date.now()) / 1000));
                const minutes = Math.floor(seconds / 60) || 0;
                seconds = seconds % 60;
                this.countDown = `${minutes < 10 ? ('0' + minutes) : minutes}:${seconds < 10 ? ('0' + seconds) : seconds}`;
            }, 1000);
        },
        beforeDestroy() {
            if (this.intervalId) clearInterval(this.intervalId);
        }
    }
</script>

<style lang="scss" scoped>

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

    @keyframes rotate_pitcher {
        0% {
            transform: rotate(0deg);
        }

        10% {
            transform: rotate(45deg);
        }

        100% {
            transform: rotate(0deg);
        }
    }

    .pitcher {
        animation: rotate_pitcher;
        animation-duration: 2s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-out;
        transform-origin: 53% 53%;
    }

    @keyframes throw_stone {
        0% {
            transform: rotate(0deg);
            opacity: 1;
        }

        10% {
            transform: rotate(45deg);
            opacity: 1;
        }

        100% {
            transform: rotate(120deg);
            opacity: 0;
        }
    }

    .stone {
        animation: throw_stone;
        animation-duration: 2s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-out;
        transform-origin: 53% 53%;
    }
</style>
