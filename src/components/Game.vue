<template>
    <div>
        <div class="game-container"
             ref="game-container"
             :class="{ dragging: dragging }"
             :style="{ transform: 'translateX(' + (-mouseMoveDelta.x) + 'px) translateY(' + (-mouseMoveDelta.y) + 'px)' }">

            <svg :width="gameWidth + 'px'"
                 :height="gameHeight + 'px'"
                 :viewBox="gameViewBox"
                 xmlns="http://www.w3.org/2000/svg"
                 version="1.1"
            >

                <!-- For the castle flags -->
                <defs>
                    <clipPath id="flagMaskCastle">
                        <polygon id="maskCastle" points="100,31 33.032,31 49.467,49.826 32.684,69 100,69"/>
                    </clipPath>
                </defs>

                <g :transform="'translate(' + (-viewPosition.x) + ', ' + (-viewPosition.y) + ')'">

                    <!-- Grid -->
                    <line v-for="index in Math.ceil(gameWidth / 500)"
                          :key="'grid-x-' + index"
                          :x1="Math.floor(viewPosition.x / 500) * 500 + index * 500"
                          :y1="viewPosition.y - gameHeight"
                          :x2="Math.floor(viewPosition.x / 500) * 500 + index * 500"
                          :y2="viewPosition.y + gameHeight"
                          stroke="rgba(0, 0, 0, 0.05)"/>
                    <line v-for="index in Math.ceil(gameHeight / 500)"
                          :key="'grid-y-' + index"
                          :y1="Math.floor(viewPosition.y / 500) * 500 + index * 500"
                          :x1="viewPosition.x - gameWidth"
                          :y2="Math.floor(viewPosition.y / 500) * 500 + index * 500"
                          :x2="viewPosition.x + gameWidth"
                          stroke="rgba(0, 0, 0, 0.05)"/>
                    <g v-for="index2 in Math.ceil(gameHeight / 1000)"
                       :key="'grid-num2-' + index2">
                        <text v-for="index in Math.ceil(gameWidth / 1000)"
                              :key="'grid-num-' + index"
                              :x="Math.floor(viewPosition.x / 1000) * 1000 + index * 1000 + 2"
                              :y="Math.floor(viewPosition.y / 1000) * 1000 + index2 * 1000 - 2"
                              class="grid-number">
                            {{ Math.floor(viewPosition.x / 1000) * 1000 + index * 1000 }} / {{ Math.floor(viewPosition.y / 1000) * 1000 + index2 * 1000 }}
                        </text>
                    </g>


                    <template v-if="activeAction === 'BUILD_CASTLE'">
                        <g v-for="castle in castles.filter(c => c.userId === user.id)"
                           :key="'build-2-castle-' + castle.x + '' + castle.y">
                            <svg :x="castle.x - maxCastleDistance"
                                 :y="castle.y - maxCastleDistance"
                                 :width="maxCastleDistance * 2"
                                 :height="maxCastleDistance * 2">
                                <circle :cx="maxCastleDistance"
                                        :cy="maxCastleDistance"
                                        :r="maxCastleDistance"
                                        fill="#c4f981"
                                        class="build-castle-green-area"
                                        stroke="none"/>
                            </svg>
                        </g>
                        <g v-for="castle in castles"
                           :key="'build-castle-' + castle.x + '' + castle.y">
                            <svg :x="castle.x - minCastleDistance"
                                 :y="castle.y - minCastleDistance"
                                 :width="minCastleDistance * 2"
                                 :height="minCastleDistance * 2">
                                <circle :cx="minCastleDistance"
                                        :cy="minCastleDistance"
                                        :r="minCastleDistance"
                                        fill="#c6cc71"
                                        stroke="none"/>
                            </svg>
                        </g>
                        <g v-for="blockArea in blockAreas" :key="'build-block-area-' + blockArea.x + '' + blockArea.y">
                            <svg :x="blockArea.x - blockAreaSize"
                                 :y="blockArea.y - blockAreaSize"
                                 :width="blockAreaSize * 2"
                                 :height="blockAreaSize * 2">
                                <circle :cx="blockAreaSize"
                                        :cy="blockAreaSize"
                                        :r="blockAreaSize"
                                        fill="#c6cc71"
                                        stroke="none"/>
                            </svg>
                        </g>
                    </template>

                    <g v-for="blockArea in blockAreas" :key="'block-area-' + blockArea.x + '' + blockArea.y">
                        <BlockArea :position="{ x: blockArea.x, y: blockArea.y }"></BlockArea>
                    </g>

                    <svg v-for="road in roads"
                         :key="road.id"
                         :x="road.middleBetweenCastles.x - road.distanceBetweenCastles * 0.4"
                         :y="road.middleBetweenCastles.y - road.distanceBetweenCastles * 0.4"
                         :width="road.distanceBetweenCastles * 0.8"
                         :height="road.distanceBetweenCastles * 0.8"
                         viewBox="0 0 403 403"
                         fill="none"
                         xmlns="http://www.w3.org/2000/svg"
                         @click="roadClicked(road)">
                        <path class="road"
                              :class="{ 'is-my-road': road.isMyRoad }"
                              :style="{transform: 'rotate(' + road.angle + 'deg)', 'transform-origin': '50% 50%' }"
                              d="M222.195 504.255L223.33 504.232L223.617 503.135C228.888 482.983 234.822 446.034 234.976 406.023C235.13 366.043 229.515 322.786 211.509 290.172C205.231 278.8 199.772 269.673 195.225 262.07C193.31 258.87 191.557 255.94 189.973 253.226C184.595 244.013 181.191 237.342 179.761 230.88C178.347 224.491 178.84 218.187 181.54 209.694C184.257 201.15 189.172 190.496 196.53 175.425C199.445 169.455 202.086 164.384 204.431 159.88C204.671 159.419 204.908 158.964 205.142 158.515C207.655 153.685 209.819 149.479 211.569 145.512C215.095 137.522 216.958 130.462 216.773 120.962C216.59 111.537 214.393 99.7574 209.929 82.3212C205.702 65.8103 199.414 44.1202 190.803 14.417C190.313 12.726 189.815 11.009 189.309 9.26554L188.632 6.92665L186.848 8.58431L174.535 20.0257L173.878 20.6369L174.106 21.5054C177.23 33.4069 181.697 44.8679 186.08 56.0521L186.293 56.5967C190.613 67.6199 194.825 78.3675 197.661 89.1468C203.4 110.963 203.478 132.793 187.102 156.725C166.164 187.323 160.443 206.064 163.087 225.416C164.398 235.01 167.755 244.67 172.151 255.88C173.344 258.921 174.613 262.077 175.943 265.383C179.53 274.302 183.553 284.305 187.68 296.059C192.048 308.503 196.618 319.17 200.902 329.171C202.104 331.976 203.283 334.729 204.429 337.453C209.668 349.909 214.231 361.82 217.203 375.688C223.141 403.396 222.77 439.134 208.26 502.668L207.833 504.539L209.752 504.501L222.195 504.255Z"
                              fill="#6F4E37"
                              stroke="#867350"
                              stroke-width="5"/>
                    </svg>

                    <BuildCastle
                            v-if="activeAction === 'BUILD_CASTLE'"
                            :user="user"
                            :zoom-factor="zoomFactor"
                            :last-mouse-position="lastMousePosition"
                            :mouse-down-timestamp="mouseDownTimestamp"
                            :dragging="dragging"
                            :view-position="viewPosition"
                            ref="buildCastle"
                            @DONE="activeAction = ''"
                            @NEW_CASTLE_POSITION="newCastlePosition = $event"
                            @ERROR="error = $event"
                    ></BuildCastle>

                    <g v-for="castle in castles"
                       :key="'castle-' + castle.x + '' + castle.y">
                        <Castle :position="{ x: castle.x, y: castle.y }"
                                :castle="castle"
                                :color="castle.color"
                                :dragging="dragging"
                                :action-action="activeAction"
                                @CLICK="castleClick($event)"
                                @HIGHLIGHT-ON="highlightedCastle = castle"
                                @HIGHLIGHT-OFF="highlightedCastle = undefined"></Castle>
                    </g>

                    <g v-for="catapult in catapults"
                       :key="'catapult-' + catapult.x + '' + catapult.y + '' + catapult.user_id">
                        <svg :x="catapult.x - minCastleDistance"
                             :y="catapult.y - minCastleDistance"
                             :width="minCastleDistance * 2"
                             :height="minCastleDistance * 2">
                            <circle :cx="minCastleDistance"
                                    :cy="minCastleDistance"
                                    r="30"
                                    fill="transparent"
                                    stroke-width="3"
                                    :stroke="catapult.color"
                                    class="catapult-ring"/>
                        </svg>
                        <Catapult :catapult="catapult"
                                  :position="{ x: catapult.x, y: catapult.y }"
                                  :color="catapult.color"></Catapult>
                    </g>

                    <g v-for="warehouse in warehouses"
                       :key="'warehouse-' + warehouse.x + '' + warehouse.y + '' + warehouse.user_id">
                        <Warehouse :position="{ x: warehouse.x, y: warehouse.y }"
                                   :color="warehouse.color"></Warehouse>
                    </g>

                </g>

            </svg>
        </div>
        <div class="frame"
             :style="{ transform: 'translateX(' + (-mouseMoveDelta.x) + 'px) translateY(' + (-mouseMoveDelta.y) + 'px)' }"></div>
        <DialogBox v-if="showDialog" @CLOSE="showDialog = false"
                   :latest-clicked-castle="latestClickedCastle"></DialogBox>
        <NavigationBar :activeAction.sync="activeAction" @BUILD_IT="triggerCastleBuild"></NavigationBar>
        <TopNavigationBar @OPEN-MENU="menuOpen = true"></TopNavigationBar>
        <Menu v-if="menuOpen" @LOGOUT="logout"
              @CLOSE-MENU="menuOpen = false"
              @GO_TO="moveMapTo($event)"
              @OPEN_PAGE="openPage"></Menu>
        <ErrorToast v-if="error">{{ error }}</ErrorToast>
        <Popup :zoomFactor="zoomFactor"
               :mouseMoveDelta="mouseMoveDelta"
               v-if="popupType && popupPosition"
               :type="popupType"
               :item="popupItem"
               :viewPosition="viewPosition"
               :position="popupPosition"
               @ERROR="error = $event"
               @CLOSE="closePopup"></Popup>
        <ActionLog></ActionLog>
        <div v-if="$store.state.progress > 0" class="loading"></div>
        <DailyReward></DailyReward>
        <ZoomButtons @ZOOM_IN="zoomIn" @ZOOM_OUT="zoomOut"></ZoomButtons>
        <PageOverlay v-if="pageOverlayOpen"
                     title="What is Castles?"
                     @CLOSE="pageOverlayOpen = false">
            <InfoView></InfoView>
        </PageOverlay>
    </div>
</template>

<script>
    import Castle from "./Castle";
    import BuildCastle from "./BuildCastle";
    import NavigationBar from "./NavigationBar";
    import config from "../config";
    import BlockArea from "./BlockArea";
    //  TODO: Remove dialog box...
    import DialogBox from "./DialogBox";
    import TopNavigationBar from "./TopNavigationBar";
    import Menu from "./Menu";
    import ErrorToast from "./ErrorToast";
    import Catapult from "./Catapult";
    import Popup from "./Popup";
    import Warehouse from "./Warehouse";
    import ActionLog from "./ActionLog";
    import DailyReward from "./DailyReward";
    import cookie from "js-cookie";
    import ZoomButtons from "./ZoomButtons";
    import PageOverlay from "./PageOverlay";
    import InfoView from "./Info";

    export default {
        name: "Game",
        components: {
            BlockArea,
            Castle,
            BuildCastle,
            NavigationBar,
            DialogBox,
            TopNavigationBar,
            Menu,
            ErrorToast,
            Catapult,
            Popup,
            Warehouse,
            ActionLog,
            DailyReward,
            ZoomButtons,
            PageOverlay,
            InfoView
        },
        data() {
            return {
                dragging: false,
                waitingForAnimationFrame: false,
                gameHeight: 0,
                gameWidth: 0,
                zoomFactor: 1,
                mouseDownTimestamp: 0,
                viewPosition: {x: 0, y: 0},
                lastMousePosition: {x: 0, y: 0},
                mouseMoveDelta: {x: 0, y: 0},
                showDialog: false,
                websocket: undefined,
                activeAction: "",
                latestClickedCastle: undefined,
                menuOpen: false,
                highlightedCastle: undefined,
                error: "",
                popupType: "",
                popupItem: undefined,
                popupPosition: undefined,
                minCastleDistance: config.MIN_CASTLE_DISTANCE,
                maxCastleDistance: config.MAX_CASTLE_DISTANCE,
                blockAreaSize: config.BLOCK_AREA_SIZE,
                newCastlePosition: undefined,
                pageOverlayOpen: false
            };
        },

        computed: {
            roads() {
                const roads = [];
                const castles = [
                    ...this.castles
                ];
                if (this.activeAction === "BUILD_CASTLE" && this.newCastlePosition) {
                    castles.push(this.newCastlePosition);
                }
                for (let i = 0; i < castles.length; i++) {
                    const c1 = castles[i];
                    for (let j = i + 1; j < castles.length; j++) {
                        const c2 = castles[j];
                        const distanceBetweenCastles = this.$util.positionDistance(c1, c2);
                        if (distanceBetweenCastles < config.MAX_CASTLE_DISTANCE) {
                            const angle = Math.floor(Math.atan2(c2.y - c1.y, c2.x - c1.x) * 180 / Math.PI) - 82;
                            const isMyRoad = c1.userId === this.user.id || c2.userId === this.user.id;
                            roads.push({
                                id: "road-" + c1.x + "-" + c1.y + "-" + c2.x + "-" + c2.y + "-" + Math.random(),
                                c1,
                                c2,
                                isMyRoad,
                                middleBetweenCastles: {
                                    x: (c1.x + c2.x) / 2,
                                    y: (c1.y + c2.y) / 2
                                },
                                angle,
                                distanceBetweenCastles
                            });
                        }
                    }
                }
                return roads;
            },
            gameHeightWithZoom() {
                return this.gameHeight * this.zoomFactor;
            },
            gameWidthWithZoom() {
                return this.gameWidth * this.zoomFactor;
            },

            warehouses() {
                return this.$store.state.warehouses;
            },

            catapults() {
                return this.$store.state.catapults;
            },
            castles() {
                return this.$store.state.castles
                    .map(c => {
                        const conquer = this.$store.state.conquers.find(co => co.castle.x === c.x && co.castle.y === c.y);
                        c.isInConquer = Boolean(conquer);
                        if (conquer)
                            c.attackHappensAt = conquer.timestamp + config.CONQUER_DELAY;
                        return c;
                    });
            },
            blockAreas() {
                return this.$store.state.blockAreas;
            },
            loading() {
                return this.$store.getters.busy;
            },
            gameViewBox() {
                const width = Math.max(0, Math.floor(this.gameWidth * this.zoomFactor));
                const height = Math.max(0, Math.floor(this.gameHeight * this.zoomFactor));
                return '0 0 ' + width + ' ' + height;
            },
            user() {
                return this.$store.state.user;
            },
            loadPosition() {
                return {
                    fromX: Math.floor(this.viewPosition.x) - 200,
                    fromY: Math.floor(this.viewPosition.y) - 200,
                    toX: Math.floor(this.viewPosition.x + this.gameWidthWithZoom) + 200,
                    toY: Math.floor(this.viewPosition.y + this.gameHeightWithZoom) + 200
                };
            }
        },

        watch: {

            menuOpen() {
                this.closePopup();
            },

            "viewPosition.x"() {
                this.closePopup();
            },

            error(val) {
                if (val) {
                    setTimeout(() => {
                        if (this.error === val) {
                            this.error = "";
                        }
                    }, 3000);
                }
            },

            activeAction(val) {
                if (val === "BUILD_CASTLE") {

                    //  TODO: this is a hotfix, cause the zoomFactor is missing in the distance calculation on build castle

                    this.zoomFactor = 1;
                }
            }
        },

        mounted() {
            this.$store.dispatch("GET_USER").then(user => {
                this.moveMapTo({x: user.startX, y: user.startY});
                this.load();
            });
            this.$store.dispatch("GET_SERVER_VERSION");
            this.$store.dispatch("GET_BLOCK_AREAS");
            this.gameHeight = this.$refs["game-container"].offsetHeight;
            this.gameWidth = this.$refs["game-container"].offsetWidth;

            window.addEventListener("resize", this.onWindowResize);
            window.addEventListener("focus", this.onWindowFocus);

            document.addEventListener("mousemove", this.onMouseMove);
            document.addEventListener("touchmove", this.onMouseMove);
            document.addEventListener("mouseup", this.onMouseUp);
            document.addEventListener("touchend", this.onMouseUp);
            document.addEventListener("keyup", this.onKeyUp);
            document.addEventListener("mousewheel", this.onScroll);

            this.$refs["game-container"].addEventListener("mousedown", this.onMouseDown);
            this.$refs["game-container"].addEventListener("touchstart", this.onMouseDown, {passive: true});

            this.attachWebsocketListener();
        },

        beforeDestroy() {
            document.removeEventListener("mousemove", this.onMouseMove);
            document.removeEventListener("touchmove", this.onMouseMove);
            document.removeEventListener("mouseup", this.onMouseUp);
            document.removeEventListener("touchend", this.onMouseUp);
            document.removeEventListener("mousewheel", this.onScroll);
            document.removeEventListener("keyup", this.onKeyUp);
            window.removeEventListener("resize", this.onWindowResize);
            window.removeEventListener("focus", this.onWindowFocus);
            this.$refs["game-container"].removeEventListener("mousedown", this.onMouseDown);
            this.$refs["game-container"].removeEventListener("touchstart", this.onMouseDown);
        },

        methods: {

            openPage() {
                this.closePopup();
                this.menuOpen = false;
                this.pageOverlayOpen = true;
            },

            onWindowFocus() {
                this.load();
            },

            triggerCastleBuild() {
                console.log("[Game] this.$refs.buildCastle.buildCastle: ", this.$refs.buildCastle.buildCastle);
                this.$refs.buildCastle.buildCastle();
            },

            closePopup() {
                this.popupPosition = undefined;
                this.popupType = "";
                this.popupItem = undefined;
            },

            onWindowResize() {
                this.gameHeight = this.$refs["game-container"].offsetHeight;
                this.gameWidth = this.$refs["game-container"].offsetWidth;
            },

            roadClicked(road) {
                if (!road.isMyRoad || Date.now() - this.mouseDownTimestamp > 300) return;
                console.log("[Game] Clicked road: ", road.middleBetweenCastles);
                this.$nextTick(() => {
                    this.popupType = "road";
                    this.popupItem = road;
                    this.popupPosition = road.middleBetweenCastles;
                });
            },

            castleClick(castle) {
                if (Date.now() - this.mouseDownTimestamp > 300) return;
                if (castle.userId === this.user.id) {
                    this.showDialog = true;
                } else {
                    this.popupType = "castle";
                    this.popupItem = castle;
                    this.popupPosition = {x: castle.x, y: castle.y - 50};
                }
                this.latestClickedCastle = castle;
            },

            moveMapTo(position) {
                this.viewPosition.x = position.x - window.innerWidth / 2;
                this.viewPosition.y = position.y - window.innerHeight / 2;
                this.load();
            },

            attachWebsocketListener() {
                this.websocket = this.$websocket.connect();
                [
                    "UPDATE_USER",
                    "NEW_ACTION_LOG",
                    "DELETE_CASTLE", "NEW_CASTLE", "UPDATE_CASTLE",
                    "DELETE_CATAPULT", "NEW_CATAPULT", "UPDATE_CATAPULT",
                    "DELETE_WAREHOUSE", "NEW_WAREHOUSE", "UPDATE_WAREHOUSE",
                    "NEW_BLOCK_AREA", "UPDATE_BLOCK_AREA",
                    "NEW_CONQUER", "UPDATE_CONQUER", "DELETE_CONQUER"
                ].forEach(eventName => {
                    this.websocket.on(eventName, data => this.$store.commit(eventName, data));
                })
            },

            onScroll(event) {
                if (this.activeAction === "BUILD_CASTLE" || this.menuOpen || this.pageOverlayOpen) return;
                const delta = event.deltaY * config.SCROLL_SENSITIVITY;
                this.zoom(delta);
            },

            zoomOut() {
                this.zoom(0.1);
            },
            zoomIn() {
                this.zoom(-0.1);
            },

            zoom(delta) {
                this.zoomFactor = Math.min(1.8, Math.max(0.3, this.zoomFactor + delta));
                if (this.zoomFactor > 0.3 && this.zoomFactor < 1.8) {
                    this.viewPosition.x -= Math.round(delta * this.gameWidth / 2);
                    this.viewPosition.y -= Math.round(delta * this.gameHeight / 2);
                    this.load();
                }
            },

            onKeyUp(event) {
                if (event.key === "Escape" || event.key === "Esc") {
                    this.activeAction = "";
                    this.showDialog = false;
                    this.closePopup();
                }
            },

            onMouseDown(event) {
                const x = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
                const y = event.clientY !== undefined ? event.clientY : event.touches[0].clientY;
                this.dragging = true;
                this.lastMousePosition.x = x;
                this.lastMousePosition.y = y;
                this.mouseDownTimestamp = Date.now();
            },
            load() {
                console.log("[Game] Load...");
                this.$store.dispatch("GET_CASTLES", this.loadPosition);
                this.$store.dispatch("GET_CATAPULTS", this.loadPosition);
                this.$store.dispatch("GET_ACTION_LOG", this.loadPosition);
                this.$store.dispatch("GET_WAREHOUSES", this.loadPosition);
                this.$store.dispatch("GET_CASTLE_PRICE");
                this.$store.dispatch("GET_WAREHOUSE_PRICE");
                this.$store.dispatch("GET_CATAPULT_PRICE");
                this.$store.dispatch("GET_CONQUERS");
                this.$store.dispatch("GET_SERVER_VERSION");
                this.$store.dispatch("GET_BLOCK_AREAS");
            },
            onMouseMove(event) {
                if (this.waitingForAnimationFrame) return;
                this.waitingForAnimationFrame = true;
                window.requestAnimationFrame(() => {
                    const x = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
                    const y = event.clientY !== undefined ? event.clientY : event.touches[0].clientY;
                    if (this.dragging) {
                        this.mouseMoveDelta.x += (this.lastMousePosition.x - x);
                        this.mouseMoveDelta.y += (this.lastMousePosition.y - y);
                    }
                    this.lastMousePosition.x = x;
                    this.lastMousePosition.y = y;
                    this.waitingForAnimationFrame = false;
                });
            },
            onMouseUp() {
                if (this.dragging) {
                    if (this.mouseMoveDelta.x) {
                        this.viewPosition.x += Math.round(this.mouseMoveDelta.x * this.zoomFactor);
                        this.viewPosition.y += Math.round(this.mouseMoveDelta.y * this.zoomFactor);
                        this.mouseMoveDelta.x = 0;
                        this.mouseMoveDelta.y = 0;
                        this.load();
                    }
                    if (this.popupType) this.closePopup();
                }
                this.dragging = false;
            },
            logout() {
                this.websocket.disconnect();
                this.$store.commit("SET_AUTH_TOKEN", "");
                this.$store.commit("SET_USER", undefined);
                cookie.remove("auth-token");
                window.location.reload(true);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .game-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: 1;
        cursor: grab;
        background-color: #b6e57b;

        &:hover {
            cursor: grab;
        }
    }

    .grid-number {
        font: 10px 'Piazzolla';
        letter-spacing: 1px;
        fill: rgba(0, 0, 0, 0.3);
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
    }

    .frame {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: 2;
        pointer-events: none;
        background: transparent;
        box-shadow: inset 0 0 20px 20px #b6e57b;
    }

    .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 2;
        padding: 0.5rem 1rem;

        button {
            font-size: 0.8rem;
        }

        span {
            color: #3B3B3B;
            font-size: 0.66rem;
        }
    }

    @keyframes pulsate_opacity {
        0% {
            opacity: 0.2;
        }

        50% {
            opacity: 0.7;
        }

        100% {
            opacity: 0.2;
        }
    }

    @keyframes pulsate_scale {
        0% {
            transform: translateX(-50px) translateY(-50px) scale(1);
            opacity: 1;
        }

        50% {
            transform: translateX(-50px) translateY(-50px) scale(1.5);
            opacity: 1;
        }

        100% {
            transform: translateX(-50px) translateY(-50px) scale(1);
            opacity: 1;
        }
    }

    .catapult-ring {
        opacity: 1;
        animation: pulsate_opacity;
        animation-iteration-count: infinite;
        animation-duration: 3.2s;
        animation-timing-function: ease-out;
    }

    .road {
        &.is-my-road:hover {
            stroke: #ff7761;
            stroke-width: 5px;
            cursor: pointer;
        }
    }

    .loading {
        position: fixed;
        z-index: 11;
        top: 50%;
        left: 50%;
        opacity: 0;
        transform: translateX(-50px) translateY(-50px);
        width: 100px;
        height: 100px;
        background-color: rgba(255, 255, 255, 0.33);
        background-image: url("../assets/logo.svg");
        background-size: contain;
        background-position: center;
        border-radius: 50%;
        box-shadow: 0 0 50px 50px rgba(255, 255, 255, 0.33);
        animation: pulsate_scale;
        animation-iteration-count: infinite;
        animation-duration: 3.2s;
        animation-timing-function: ease-out;
        animation-delay: 0.5s;
    }
</style>
