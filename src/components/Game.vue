<template>
    <div>
        <div class="frame"
             ref="frame"></div>
        <div class="game-container"
             ref="game-container">

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
                            {{ Math.floor(viewPosition.x / 1000) * 1000 + index * 1000 }} / {{
                            Math.floor(viewPosition.y / 1000) * 1000 + index2 * 1000 }}
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
                        <g v-for="blockArea in blockAreas"
                           :key="'build-block-area-' + blockArea.x + '' + blockArea.y">
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

                    <g v-for="item in renderItems" :key="item._id">

                        <BlockArea v-if="item.isBlockArea"
                                   :position="{ x: item.x, y: item.y }"></BlockArea>

                        <svg v-else-if="item.isRoad"
                             :x="item.x - item.distanceBetweenCastles * 0.4"
                             :y="item.y - item.distanceBetweenCastles * 0.4"
                             :width="item.distanceBetweenCastles * 0.8"
                             :height="item.distanceBetweenCastles * 0.8"
                             viewBox="0 0 403 403"
                             fill="none"
                             xmlns="http://www.w3.org/2000/svg"
                             @click="onRoadClick(item)">
                            <path class="road"
                                  :class="{ 'is-my-road': item.isMyRoad }"
                                  :style="{transform: 'rotate(' + item.angle + 'deg)', 'transform-origin': '50% 50%' }"
                                  d="M222.195 504.255L223.33 504.232L223.617 503.135C228.888 482.983 234.822 446.034 234.976 406.023C235.13 366.043 229.515 322.786 211.509 290.172C205.231 278.8 199.772 269.673 195.225 262.07C193.31 258.87 191.557 255.94 189.973 253.226C184.595 244.013 181.191 237.342 179.761 230.88C178.347 224.491 178.84 218.187 181.54 209.694C184.257 201.15 189.172 190.496 196.53 175.425C199.445 169.455 202.086 164.384 204.431 159.88C204.671 159.419 204.908 158.964 205.142 158.515C207.655 153.685 209.819 149.479 211.569 145.512C215.095 137.522 216.958 130.462 216.773 120.962C216.59 111.537 214.393 99.7574 209.929 82.3212C205.702 65.8103 199.414 44.1202 190.803 14.417C190.313 12.726 189.815 11.009 189.309 9.26554L188.632 6.92665L186.848 8.58431L174.535 20.0257L173.878 20.6369L174.106 21.5054C177.23 33.4069 181.697 44.8679 186.08 56.0521L186.293 56.5967C190.613 67.6199 194.825 78.3675 197.661 89.1468C203.4 110.963 203.478 132.793 187.102 156.725C166.164 187.323 160.443 206.064 163.087 225.416C164.398 235.01 167.755 244.67 172.151 255.88C173.344 258.921 174.613 262.077 175.943 265.383C179.53 274.302 183.553 284.305 187.68 296.059C192.048 308.503 196.618 319.17 200.902 329.171C202.104 331.976 203.283 334.729 204.429 337.453C209.668 349.909 214.231 361.82 217.203 375.688C223.141 403.396 222.77 439.134 208.26 502.668L207.833 504.539L209.752 504.501L222.195 504.255Z"
                                  fill="#6F4E37"
                                  stroke="#867350"
                                  stroke-width="5"/>
                        </svg>

                        <g v-else-if="item.isCastle">
                            <svg :x="item.x - minCastleDistance"
                                 :y="item.y - minCastleDistance"
                                 :width="minCastleDistance * 2"
                                 :height="minCastleDistance * 2">
                                <circle :cx="minCastleDistance"
                                        :cy="minCastleDistance"
                                        :r="35"
                                        :fill="activeAction === 'BUILD_CASTLE' ? '#c6cc71' : 'rgb(181,230,123)'"
                                        stroke="none"/>
                            </svg>
                        </g>

                        <g v-else-if="item.isKnight">
                            <Knight :position="knightViewPosition(item)"
                                    :knight="item"
                                    :view-position="viewPosition"
                                    :is-active="activeAction === 'MOVE_KNIGHT' && activeKnight && activeKnight.id === item.id"
                                    @CLICK="onKnightClick"
                                    :color="item.color"></Knight>
                        </g>

                        <g v-if="item.isCastle">
                            <Castle :position="{ x: item.x, y: item.y }"
                                    :castle="item"
                                    :color="item.color"
                                    :dragging="dragging"
                                    :is-possible-knight-destination="isPossibleKnightDestination(item)"
                                    :pageOverlayOpen="pageOverlayOpen"
                                    :action-action="activeAction"
                                    @CLICK="onCastleClick($event)"
                                    @HIGHLIGHT-ON="highlightedCastle = item"
                                    @HIGHLIGHT-OFF="highlightedCastle = undefined"></Castle>
                        </g>

                        <g v-else-if="item.isCatapult">
                            <svg :x="item.x - minCastleDistance"
                                 :y="item.y - minCastleDistance"
                                 :width="minCastleDistance * 2"
                                 :height="minCastleDistance * 2">
                                <circle :cx="minCastleDistance"
                                        :cy="minCastleDistance"
                                        r="30"
                                        fill="transparent"
                                        stroke-width="3"
                                        :stroke="item.color"
                                        class="catapult-ring"/>
                            </svg>
                            <Catapult :catapult="item"
                                      :position="{ x: item.x, y: item.y }"
                                      :color="item.color"></Catapult>
                        </g>

                        <g v-else-if="item.isWarehouse">
                            <Warehouse
                                    :position="{ x: item.x, y: item.y }"
                                    :dragging="dragging"
                                    :pageOverlayOpen="pageOverlayOpen"
                                    :warehouse="item"
                                    @CLICK="openWarehousePopup($event)"
                                    :color="item.color"></Warehouse>
                        </g>
                    </g>

                    <BuildCastle
                            v-if="activeAction === 'BUILD_CASTLE'"
                            :user="user"
                            :zoom-factor="zoomFactor"
                            :last-mouse-position="lastMousePosition"
                            :mouse-down-timestamp="mouseDownTimestamp"
                            :dragging="dragging"
                            :pageOverlayOpen="pageOverlayOpen"
                            :view-position="viewPosition"
                            ref="buildCastle"
                            @DONE="activeAction = ''"
                            @NEW_CASTLE_POSITION="newCastlePosition = $event"
                            @ERROR="error = $event"
                    ></BuildCastle>

                    <svg v-if="showActionItemArrow"
                         :x="activeActionItem.x - 75"
                         :y="activeActionItem.y - 150"
                         viewBox="0 0 150 150"
                         width="150"
                         height="150">
                        <image href="../assets/arrow.svg"
                               :height="50"
                               class="destination-arrow"
                               :width="50"
                               :x="50"
                               :y="-60"
                        />
                    </svg>

                </g>


            </svg>
        </div>

        <!-- -- -- -- -- -- -- -- -- UI Elements -- -- -- -- -- -- -- -- -->

        <NavigationBar :activeAction.sync="activeAction"
                       @BUILD_IT="triggerCastleBuild"></NavigationBar>

        <TopNavigationBar @OPEN-MENU="openOverlay" :dropDownShown.sync="topNavigationLargeOpen"></TopNavigationBar>

        <Overlay v-if="overlayOpen"
                 :type.sync="overlayType"
                 @LOGOUT="logout"
                 @ERROR="error = $event"
                 @CLOSE-OVERLAY="closeOverlay"
                 @GO_TO="moveMapTo($event)"
                 @SHOW-ACTION-On-MAP="showActionOnMap($event)"
                 @OPEN_PAGE="openPage($event)"></Overlay>

        <InfoOverlay v-if="infoOverlayOpen"
                     :type.sync="infoOverlayType"
                     @SHOW-ON-MAP="showActionOnMap($event)"
                     @CLOSE-OVERLAY="closeInfoOverlay"></InfoOverlay>

        <ErrorToast v-if="error" @CLICK="error = ''">{{ error }}</ErrorToast>

        <Popup :zoomFactor="zoomFactor"
               :mouseMoveDelta="mouseMoveDelta"
               v-if="!dragging && popupType && popupPosition"
               :type.sync="popupType"
               :item="popupItem"
               :viewPosition="viewPosition"
               :position="popupPosition"
               @MOVE_KNIGHT="moveKnight"
               @ERROR="error = $event"
               @CLOSE="closePopup"></Popup>

        <ActionLog></ActionLog>

        <div v-if="$store.state.progress > 0" class="loading"></div>

        <DailyReward></DailyReward>

        <HomeButton @GO_HOME="goHome"></HomeButton>
        <OpenQuestButton @OPEN="openInfoOverlay('QUESTS')"></OpenQuestButton>
        <OpenFriendsButton @OPEN="openOverlay('friends')"></OpenFriendsButton>

        <ZoomButtons @ZOOM_IN="zoomIn" @ZOOM_OUT="zoomOut"></ZoomButtons>

        <!-- Pages -->
        <PageOverlay v-if="pageOverlayOpen && pageOverlayType === 'info'"
                     title="What is Castles?"
                     @CLOSE="closePage">
            <InfoView></InfoView>
        </PageOverlay>
        <PageOverlay v-else-if="pageOverlayOpen && pageOverlayType === 'forum'"
                     title="Forum"
                     @CLOSE="closePage">
            <Forum></Forum>
        </PageOverlay>
    </div>
</template>

<script>
    import config from "../config";
    import cookie from "js-cookie";
    import Forum from "./pages/Forum";
    import InfoView from "./pages/Info";
    import Warehouse from "./Warehouse";
    import Overlay from "./uiElements/Overlay.vue";
    import Popup from "./uiElements/Popup";
    import PageOverlay from "./PageOverlay";
    import Knight from "./inGameElements/Knight";
    import Castle from "./inGameElements/Castle";
    import ActionLog from "./uiElements/ActionLog";
    import Catapult from "./inGameElements/Catapult";
    import ErrorToast from "./uiElements/ErrorToast";
    import HomeButton from "./uiElements/HomeButton";
    import ZoomButtons from "./uiElements/ZoomButtons";
    import BlockArea from "./inGameElements/BlockArea";
    import DailyReward from "./uiElements/DailyReward";
    import NavigationBar from "./uiElements/NavigationBar";
    import BuildCastle from "./inGameElements/BuildCastle";
    import TopNavigationBar from "./uiElements/TopNavigationBar";
    import InfoOverlay from "./uiElements/InfoOverlay";
    import {propsToCamelCase} from "../plugins/axios";
    import OpenQuestButton from "./uiElements/OpenQuestButton";
    import OpenFriendsButton from "./uiElements/OpenFriendsButton";

    /**
     * @typedef GameComponent
     * @type object
     * @property {Knight} activeKnight
     */

    export default {
        name: "Game",
        components: {
            OpenFriendsButton,
            InfoOverlay,
            Forum,
            Popup,
            Knight,
            Castle,
            Overlay,
            Catapult,
            InfoView,
            BlockArea,
            ActionLog,
            Warehouse,
            ErrorToast,
            HomeButton,
            BuildCastle,
            DailyReward,
            ZoomButtons,
            PageOverlay,
            NavigationBar,
            OpenQuestButton,
            TopNavigationBar
        },
        data() {
            return {
                fps: 0,
                error: "",
                gameWidth: 0,
                gameHeight: 0,
                popupType: "",
                zoomFactor: 1,
                dragging: false,
                renderItems: [],
                isLoading: false,
                activeAction: "",
                showDialog: false,
                overlayOpen: false,
                touchPositions: [],
                overlayType: "menu",
                pageOverlayType: "",
                websocket: undefined,
                popupItem: undefined,
                mouseDownTimestamp: 0,
                pageOverlayOpen: false,
                infoOverlayOpen: false,
                infoOverlayType: "",
                activeKnight: undefined,
                popupPosition: undefined,
                renderWaiterId: undefined,
                viewPosition: {x: 0, y: 0},
                zoomLoadTimeout: undefined,
                showActionItemArrow: false,
                activeActionItem: undefined,
                highlightedCastle: undefined,
                newCastlePosition: undefined,
                mouseMoveDelta: {x: 0, y: 0},
                topNavigationLargeOpen: false,
                latestClickedCastle: undefined,
                lastRenderTimestamp: undefined,
                lastMousePosition: {x: 0, y: 0},
                waitingForAnimationFrame: false,
                actionItemArrowTimer: undefined,
                storePositionInUrlWaiter: undefined,
                blockAreaSize: config.BLOCK_AREA_SIZE,
                minCastleDistance: config.MIN_CASTLE_DISTANCE,
                maxCastleDistance: config.MAX_CASTLE_DISTANCE
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
                        if (distanceBetweenCastles <= config.MAX_CASTLE_DISTANCE) {
                            const angle = Math.floor(Math.atan2(c2.y - c1.y, c2.x - c1.x) * 180 / Math.PI) - 82;
                            const isMyRoad = c1.userId === this.user.id || c2.userId === this.user.id;
                            const x = (c1.x + c2.x) / 2;
                            const y = (c1.y + c2.y) / 2;
                            roads.push({
                                _id: "road-" + x + "-" + y,
                                c1,
                                c2,
                                isMyRoad,
                                x,
                                y,
                                angle,
                                distanceBetweenCastles,
                                isRoad: true
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
                return this.$store.state.warehouses.map(w => {
                    w.isWarehouse = true;
                    w._id = "warehouse-" + w.x + "-" + w.y;
                    return w;
                });
            },

            knights() {
                return this.$store.state.knights.map(k => {
                    k.isKnight = true;
                    k._id = "knight-" + k.x + "-" + k.y + "-" + k.id;
                    return k;
                });
            },

            catapults() {
                return this.$store.state.catapults.map(c => {
                    c.isCatapult = true;
                    c._id = "catapult-" + c.x + "-" + c.y;
                    return c;
                });
            },

            castles() {
                return this.$store.state.castles
                    .map(c => {
                        const conquer = this.$store.state.conquers.find(co => co.castle.x === c.x && co.castle.y === c.y);
                        c.isInConquer = Boolean(conquer);
                        if (conquer)
                            c.attackHappensAt = conquer.timestamp + config.CONQUER_DELAY;

                        const knight = this.$store.state.knights.find(knight => knight.x === c.x && knight.y === c.y);
                        c.hasKnight = Boolean(knight);

                        c.isCastle = true;
                        c._id = "castle-" + c.x + "-" + c.y;

                        return c;
                    });
            },

            blockAreas() {
                return this.$store.state.blockAreas.filter(this.isInViewPosition).map(b => {
                    b.isBlockArea = true;
                    b._id = "block-area-" + b.x + "-" + b.y;
                    return b;
                });
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

            roads: {
                deep: true,
                handler() {
                    this.updateRenderItems("roads");
                }
            },

            castles: {
                deep: true,
                handler() {
                    this.updateRenderItems("castles");
                }
            },

            blockAreas: {
                deep: true,
                handler() {
                    this.updateRenderItems("blockAreas");
                }
            },

            catapults: {
                deep: true,
                handler() {
                    this.updateRenderItems("catapults");
                }
            },

            knights: {
                deep: true,
                handler() {
                    this.updateRenderItems("knights");
                }
            },

            warehouses: {
                deep: true,
                handler() {
                    this.updateRenderItems("warehouses");
                }
            },

            showActionItemArrow(val) {
                if (val) {
                    if (this.actionItemArrowTimer) clearTimeout(this.actionItemArrowTimer);
                    this.actionItemArrowTimer = setTimeout(() => {
                        this.showActionItemArrow = false;
                    }, 3000);
                }
            },

            activeAction(val) {
                if (val)
                    this.closePopup();
            },

            "viewPosition.x"() {
                this.closePopup();
                this.storePositionInUrl();
                this.topNavigationLargeOpen = false;
            },

            error(val) {
                if (val) {
                    setTimeout(() => {
                        if (this.error === val) {
                            this.error = "";
                        }
                    }, 3500);
                }
            }
        },

        mounted() {
            const zoomFactor = this.$util.getUrlParam("zoom");
            if (zoomFactor) this.zoomFactor = Number(zoomFactor);

            const xPositionInUrl = Number(this.$util.getUrlParam("x"));
            const yPositionInUrl = Number(this.$util.getUrlParam("y"));
            const usePositionFromUrl = Boolean(yPositionInUrl && xPositionInUrl);

            this.$store.dispatch("GET_USER").then(user => {

                // Move map to is calling load at the end!
                this.moveMapTo({
                    x: usePositionFromUrl ? xPositionInUrl : user.startX,
                    y: usePositionFromUrl ? yPositionInUrl : user.startY
                });
            }).catch((e) => {
                console.log("[game] Error on get user: ", e.response);
                this.logout();
            });
            this.$store.dispatch("GET_BLOCK_AREAS");
            this.$store.dispatch("GET_SERVER_VERSION");
            this.gameWidth = this.$refs["game-container"].offsetWidth;
            this.gameHeight = this.$refs["game-container"].offsetHeight;

            window.addEventListener("focus", this.onWindowFocus);
            window.addEventListener("resize", this.onWindowResize);

            document.addEventListener("keyup", this.onKeyUp);
            document.addEventListener("mouseup", this.onMouseUp);
            document.addEventListener("touchend", this.onMouseUp);
            document.addEventListener("mousewheel", this.onScroll);
            document.addEventListener("mousemove", this.onMouseMove);
            document.addEventListener("touchmove", this.onTouchMove);

            this.$refs["game-container"].addEventListener("mousedown", this.onMouseDown);
            this.$refs["game-container"].addEventListener("touchstart", this.onTouchDown, {passive: true});

            this.attachWebsocketListener();

            const page = this.$util.getUrlParam("page");
            const overlayType = this.$util.getUrlParam("overlay-type");
            if (page) {
                this.openPage(page);
            } else if (overlayType) {
                this.openOverlay(overlayType);
            }
        },

        beforeDestroy() {
            document.removeEventListener("mousemove", this.onMouseMove);
            document.removeEventListener("touchmove", this.onTouchMove);
            document.removeEventListener("mouseup", this.onMouseUp);
            document.removeEventListener("touchend", this.onMouseUp);
            document.removeEventListener("mousewheel", this.onScroll);
            document.removeEventListener("keyup", this.onKeyUp);
            window.removeEventListener("resize", this.onWindowResize);
            window.removeEventListener("focus", this.onWindowFocus);
            this.$refs["game-container"].removeEventListener("mousedown", this.onMouseDown);
            this.$refs["game-container"].removeEventListener("touchstart", this.onTouchDown);
        },

        methods: {

            // - - - - - - - - - - - - - - - - - - - - - GENERAL - - - - - - - - - - - - - - - - - - - - - //

            /**
             * Get all items to render and sort them by y.
             */
            updateRenderItems() {
                if (this.renderWaiterId) {
                    clearTimeout(this.renderWaiterId);
                    this.renderWaiterId = undefined;
                }
                this.renderWaiterId = setTimeout(() => {
                    this.renderItems = this.roads.concat([
                        ...this.knights,
                        ...this.castles,
                        ...this.blockAreas,
                        ...this.catapults,
                        ...this.warehouses
                    ].sort((i1, i2) => i1.y - i2.y));
                }, 40);
            },

            async load() {
                if (this.isLoading) return;
                this.isLoading = true;
                try {
                    await Promise.all([
                        this.$store.dispatch("GET_CASTLES", this.loadPosition),
                        this.$store.dispatch("GET_KNIGHTS", this.loadPosition),
                        this.$store.dispatch("GET_CATAPULTS", this.loadPosition),
                        this.$store.dispatch("GET_ACTION_LOG", this.loadPosition),
                        this.$store.dispatch("GET_WAREHOUSES", this.loadPosition),
                        this.$store.dispatch("GET_CASTLE_PRICE"),
                        this.$store.dispatch("GET_WAREHOUSE_PRICE"),
                        this.$store.dispatch("GET_WAREHOUSE_UPGRADE_PRICE"),
                        this.$store.dispatch("GET_CATAPULT_PRICE"),
                        this.$store.dispatch("GET_KNIGHT_PRICE"),
                        this.$store.dispatch("GET_CONQUERS"),
                        this.$store.dispatch("GET_SERVER_VERSION"),
                        this.$store.dispatch("GET_BLOCK_AREAS"),
                        this.$store.dispatch("GET_QUESTS")
                    ]);
                } catch (e) {
                    this.error = this.$t("general.error.load");
                }
                this.isLoading = false;
            },

            logout() {
                this.websocket.disconnect();
                this.$store.commit("SET_AUTH_TOKEN", "");
                this.$store.commit("SET_USER", undefined);
                cookie.remove("auth-token");
                window.location.reload(true);
            },

            // - - - - - - - - - - - - - - - - - - - - - MAP & POSITION - - - - - - - - - - - - - - - - - - - - - //

            goHome() {
                this.moveMapTo({
                    x: this.user.startX,
                    y: this.user.startY
                });
            },

            storePositionInUrl() {
                if (this.storePositionInUrlWaiter) {
                    clearTimeout(this.storePositionInUrlWaiter);
                    this.storePositionInUrlWaiter = undefined;
                }
                this.storePositionInUrlWaiter = setTimeout(() => {
                    const x = this.viewPosition.x + (window.innerWidth / 2 * this.zoomFactor);
                    const y = this.viewPosition.y + (window.innerHeight / 2 * this.zoomFactor);
                    this.$util.setUrlParam("x", x.toFixed(2));
                    this.$util.setUrlParam("y", y.toFixed(2));
                    clearTimeout(this.storePositionInUrlWaiter);
                    this.storePositionInUrlWaiter = undefined;
                }, 300)
            },

            isInViewPosition({x, y}) {
                const p = this.loadPosition;
                return x < p.toX && x > p.fromX && y < p.toY && y > p.fromY;
            },

            moveMapTo(position) {
                this.viewPosition.x = position.x - (window.innerWidth / 2 * this.zoomFactor);
                this.viewPosition.y = position.y - (window.innerHeight / 2 * this.zoomFactor);
                this.load();
            },

            /**
             * @param {ActionLog} actionItem
             */
            showActionOnMap(actionItem) {
                this.activeActionItem = actionItem;
                this.showActionItemArrow = true;
                this.moveMapTo(actionItem);
            },

            // - - - - - - - - - - - - - - - - - - - - - OVERLAYS - - - - - - - - - - - - - - - - - - - - - //

            closeInfoOverlay() {
                this.infoOverlayOpen = false;
                this.infoOverlayType = "";
            },

            openInfoOverlay(type) {
                this.closeOverlay();
                this.closePopup();
                this.closePage();
                this.topNavigationLargeOpen = false;
                this.infoOverlayOpen = true;
                this.infoOverlayType = type;
            },

            /**
             * @param {string} type
             */
            openOverlay(type) {
                this.closePopup();
                this.closePage();
                this.topNavigationLargeOpen = false;
                this.overlayType = type || "menu";
                this.overlayOpen = true;
                this.$util.setUrlParam("overlay-type", this.overlayType);
            },

            closeOverlay() {
                this.overlayOpen = false;
                this.overlayType = "menu";
                this.$util.deleteUrlParam("overlay-type");
            },

            closePage() {
                this.pageOverlayOpen = false;
                this.$util.deleteUrlParam("page");
            },

            openPage($event) {
                this.closePopup();
                this.overlayOpen = false;
                this.pageOverlayOpen = true;
                this.pageOverlayType = $event;
                this.$util.setUrlParam("page", $event);
                this.topNavigationLargeOpen = false;
            },

            /**
             * @param {Position} position
             * @param {('knight'|'road'|'castle'|'warehouse')} type
             * @param {*} item
             */
            openPopup(position, type, item) {
                if (this.activeAction) return;
                this.popupPosition = position;
                this.popupType = type;
                this.popupItem = item;
                this.topNavigationLargeOpen = false;
            },

            closePopup() {
                this.popupPosition = undefined;
                this.popupType = "";
                this.popupItem = undefined;
            },

            openWarehousePopup(warehouse) {
                if (warehouse.userId === this.user.id) {
                    this.openPopup({
                        x: warehouse.x,
                        y: warehouse.y - 40
                    }, "warehouse", warehouse);
                }
            },

            // - - - - - - - - - - - - - - - - - - - - - WINDOW - - - - - - - - - - - - - - - - - - - - - //

            async onWindowFocus() {
                await this.$store.dispatch("GET_USER");
                this.load();
            },

            onWindowResize() {
                this.gameHeight = this.$refs["game-container"].offsetHeight;
                this.gameWidth = this.$refs["game-container"].offsetWidth;
            },

            onScroll(event) {
                if (this.overlayOpen || this.pageOverlayOpen || this.infoOverlayOpen) return;
                const delta = event.deltaY * config.SCROLL_SENSITIVITY;
                this.zoom(delta);
            },

            // - - - - - - - - - - - - - - - - - - - - - IN GAME LOGIC - - - - - - - - - - - - - - - - - - - - - //


            /**
             * @param {Knight} knight
             */
            knightViewPosition(knight) {
                if (!knight.goToX || !knight.goToY)
                    return {x: knight.x, y: knight.y};
                return {
                    x: (knight.x + knight.goToX) / 2,
                    y: (knight.y + knight.goToY) / 2
                };
            },

            /**
             * @param {Knight} knight
             */
            onKnightClick(knight) {
                if (Date.now() - this.mouseDownTimestamp > 300) return;
                const position = this.knightViewPosition(knight);
                position.y -= 100;
                this.openPopup(position, "knight", knight);
            },

            onRoadClick(road) {
                if (!road.isMyRoad || Date.now() - this.mouseDownTimestamp > 300) return;
                console.log("[Game] Clicked road: ", road);
                this.$nextTick(() => {
                    this.openPopup(road, "road", road);
                });
            },

            /**
             * @param {Castle} castle
             */
            async onCastleClick(castle) {
                if (Date.now() - this.mouseDownTimestamp > 300) return;
                if (this.activeAction === "MOVE_KNIGHT") {
                    try {
                        await this.$store.dispatch("MOVE_KNIGHT", {
                            knightId: this.activeKnight.id,
                            x: castle.x,
                            y: castle.y
                        });
                    } catch (e) {
                        this.error = e.response.data.message;
                    }
                    this.cancelAction();
                    return;
                }
                this.openPopup({
                    x: castle.x,
                    y: castle.y - 50
                }, "castle", castle);
                this.latestClickedCastle = castle;
            },

            triggerCastleBuild() {
                this.$refs.buildCastle.buildCastle();
            },

            /**
             * @param {Knight} knight
             */
            moveKnight(knight) {
                this.activeAction = "MOVE_KNIGHT";
                this.activeKnight = knight;
            },

            /**
             * @param {Castle} castle
             */
            isPossibleKnightDestination(castle) {
                if (this.activeAction !== "MOVE_KNIGHT") return false;
                return this.$util.positionDistance({
                    x: castle.x,
                    y: castle.y
                }, this.activeKnight) <= config.MAX_CASTLE_DISTANCE;
            },

            cancelAction() {
                this.activeAction = "";
                this.activeKnight = undefined;
            },

            // - - - - - - - - - - - - - - - - - - - - - WEBSOCKET - - - - - - - - - - - - - - - - - - - - - //

            attachWebsocketListener() {
                this.websocket = this.$websocket.connect();
                [
                    "UPDATE_USER",
                    "NEW_ACTION_LOG",
                    "DELETE_CASTLE", "NEW_CASTLE", "UPDATE_CASTLE",
                    "DELETE_KNIGHT", "NEW_KNIGHT", "UPDATE_KNIGHT",
                    "DELETE_CATAPULT", "NEW_CATAPULT", "UPDATE_CATAPULT",
                    "DELETE_WAREHOUSE", "NEW_WAREHOUSE", "UPDATE_WAREHOUSE",
                    "NEW_BLOCK_AREA", "UPDATE_BLOCK_AREA",
                    "NEW_CONQUER", "UPDATE_CONQUER", "DELETE_CONQUER"
                ].forEach(eventName => {
                    this.websocket.on(eventName, data => {
                        this.$store.commit(eventName, propsToCamelCase(data))
                    });
                });

                this.websocket.on("ACTIONS_DURING_OFFLINE", actions => {
                    if (actions.length > 0) {
                        this.$store.commit("ACTIONS_DURING_OFFLINE", actions);
                        this.openInfoOverlay("OFFLINE_HISTORY");
                    }
                });
            },

            // - - - - - - - - - - - - - - - - - - - - - ZOOM - - - - - - - - - - - - - - - - - - - - - //

            zoomOut() {
                this.zoom(0.3);
            },
            zoomIn() {
                this.zoom(-0.3);
            },

            zoom(delta) {
                window.requestAnimationFrame(() => {
                    const screenWidth = Math.max(this.gameHeight, this.gameWidth) * this.zoomFactor;
                    if (delta > 0 && screenWidth > 1920) return;
                    if (delta < 0 && screenWidth < 200) return;
                    this.zoomFactor = this.zoomFactor + delta;
                    this.viewPosition.x -= Math.round(delta * this.gameWidth / 2);
                    this.viewPosition.y -= Math.round(delta * this.gameHeight / 2);
                    if (this.zoomLoadTimeout) clearTimeout(this.zoomLoadTimeout);
                    this.zoomLoadTimeout = setTimeout(() => {
                        this.load();
                        this.$util.setUrlParam("zoom", this.zoomFactor.toFixed(2));
                    }, 500);
                });
            },

            // - - - - - - - - - - - - - - - - - - - - - INPUT HANDLERS - - - - - - - - - - - - - - - - - - - - - //

            onKeyUp(event) {
                if (event.key === "Escape" || event.key === "Esc") {
                    this.cancelAction();
                    this.showDialog = false;
                    this.closePopup();
                }
            },

            onMouseDown(event) {
                const x = event.clientX;
                const y = event.clientY;
                this.onPointerDown({x, y});
            },

            onTouchDown(event) {
                const x = event.touches[0].clientX;
                const y = event.touches[0].clientY;
                if (event.touches.length === 2) {
                    this.touchPositions = [
                        {x: event.touches[0].clientX, y: event.touches[0].clientY},
                        {x: event.touches[1].clientX, y: event.touches[1].clientY}
                    ];
                }
                this.onPointerDown({x, y});
            },

            onPointerDown({x, y}) {
                this.dragging = true;
                this.lastMousePosition.x = x;
                this.lastMousePosition.y = y;
                this.mouseDownTimestamp = Date.now();
            },

            onTouchMove(event) {
                event.preventDefault();
                const x = event.touches[0].clientX;
                const y = event.touches[0].clientY;
                this.onPointerMove({x, y}, event);
            },

            onMouseMove(event) {
                const x = event.clientX;
                const y = event.clientY;
                this.onPointerMove({x, y}, event);
            },

            onPointerMove({x, y}, event) {
                if (!this.dragging) return;
                window.requestAnimationFrame(() => {
                    if (this.touchPositions.length === 2 && event.touches[1]) { // is pinch
                        const lastDiff = Math.abs(this.touchPositions[0].x - this.touchPositions[1].x);
                        this.touchPositions[0] = {x: event.touches[0].clientX, y: event.touches[0].clientY};
                        this.touchPositions[1] = {x: event.touches[1].clientX, y: event.touches[1].clientY};
                        const curDiff = Math.abs(this.touchPositions[0].x - this.touchPositions[1].x);
                        const diff = (lastDiff - curDiff) / (this.gameWidth / 3);
                        if (diff) this.zoom(diff);
                    }  // is drag
                    this.mouseMoveDelta.x += (this.lastMousePosition.x - x);
                    this.mouseMoveDelta.y += (this.lastMousePosition.y - y);
                    this.lastMousePosition.x = x;
                    this.lastMousePosition.y = y;
                    this.updateMouseMoveDeltaTransform();
                });
            },

            updateMouseMoveDeltaTransform() {
                const transformStyle = 'translateX(' + (-this.mouseMoveDelta.x) + 'px) translateY(' + (-this.mouseMoveDelta.y) + 'px)';
                this.$refs["game-container"].style.transform = transformStyle;
                this.$refs["frame"].style.transform = transformStyle;
            },

            onMouseUp() {
                if (this.touchPositions.length === 2) {
                    this.touchPositions.length = 0;
                }
                if (this.dragging) {
                    if (this.mouseMoveDelta.x) {
                        this.viewPosition.x += Math.round(this.mouseMoveDelta.x * this.zoomFactor);
                        this.viewPosition.y += Math.round(this.mouseMoveDelta.y * this.zoomFactor);
                        this.mouseMoveDelta.x = 0;
                        this.mouseMoveDelta.y = 0;
                        this.updateMouseMoveDeltaTransform();
                        this.load();
                    }
                    if (this.popupType) this.closePopup();
                }
                this.dragging = false;
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
        will-change: transform;

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
        will-change: transform;
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
            transform: scale(1);
            opacity: 1;
        }

        50% {
            transform: scale(1.5);
            opacity: 1;
        }

        100% {
            transform: scale(1);
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
        bottom: 1.5rem;
        right: 2rem;
        opacity: 0;
        width: 50px;
        height: 50px;
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

        @media only screen and (max-width: 600px) {
            display: none;
        }
    }

    @keyframes move_arrow {
        0% {
            transform: scale(1, -1) translateY(0);
        }

        50% {
            transform: scale(1, -1) translateY(20px);
        }

        100% {
            transform: scale(1, -1) translateY(0);
        }
    }

    .destination-arrow {
        transform-origin: 0% 10%;
        transform: scale(1, -1);
        animation: move_arrow;
        animation-iteration-count: infinite;
        animation-duration: 1s;
        animation-timing-function: ease-in-out;
    }

</style>
