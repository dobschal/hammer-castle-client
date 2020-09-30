<template>
    <div>
        <div class="game-container" ref="game-container">
            <svg
                    :width="gameWidth + 'px'"
                    :height="gameHeight + 'px'"
                    :viewBox="gameViewBox"
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
            >

                <BuildCastle
                        v-if="activeAction === 'BUILD_CASTLE'"
                        :user="user"
                        :zoom-factor="zoomFactor"
                        :last-mouse-position="lastMousePosition"
                        :mouse-down-timestamp="mouseDownTimestamp"
                        :dragging="dragging"
                        :view-position="viewPosition"
                        @DONE="activeAction = ''"
                        @ERROR="error = $event"
                ></BuildCastle>

                <g v-for="blockArea in blockAreas" :key="'block-area-' + blockArea.x + '' + blockArea.y">
                    <svg v-if="activeAction === 'BUILD_CASTLE'"
                         :x="blockArea.x - viewPosition.x - blockAreaSize"
                         :y="blockArea.y - viewPosition.y - blockAreaSize"
                         :width="blockAreaSize * 2"
                         :height="blockAreaSize * 2">
                        <circle :cx="blockAreaSize"
                                :cy="blockAreaSize"
                                :r="blockAreaSize"
                                fill="transparent"
                                stroke-width="3"
                                stroke-opacity="0.5"
                                stroke="green"/>
                    </svg>
                    <BlockArea
                            :position="{ x: blockArea.x - viewPosition.x, y: blockArea.y - viewPosition.y }"></BlockArea>
                </g>

                <Roads :roads="roads" @CLICK="roadClicked"></Roads>

                <g v-for="castle in castles"
                   :key="'castle-' + castle.x + '' + castle.y">
                    <svg v-if="activeAction === 'BUILD_CASTLE'"
                         :x="castle.x - viewPosition.x - minCastleDistance"
                         :y="castle.y - viewPosition.y - minCastleDistance"
                         :width="minCastleDistance * 2"
                         :height="minCastleDistance * 2">
                        <circle :cx="minCastleDistance"
                                :cy="minCastleDistance"
                                :r="minCastleDistance"
                                fill="transparent"
                                stroke-width="3"
                                stroke-opacity="0.5"
                                :stroke="castle.color"/>
                    </svg>
                    <Castle :position="{ x: castle.x - viewPosition.x, y: castle.y - viewPosition.y }"
                            :castle="castle"
                            :color="castle.color"
                            @CLICK="castleClick($event)"
                            @HIGHLIGHT-ON="highlightedCastle = castle"
                            @HIGHLIGHT-OFF="highlightedCastle = undefined"></Castle>
                </g>

                <g v-for="catapult in catapults"
                   :key="'catapult-' + catapult.x + '' + catapult.y + '' + catapult.user_id">
                    <svg :x="catapult.x - viewPosition.x - minCastleDistance"
                         :y="catapult.y - viewPosition.y - minCastleDistance"
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
                              :position="{ x: catapult.x - viewPosition.x, y: catapult.y - viewPosition.y }"
                              :color="catapult.color"></Catapult>
                </g>

                <g v-for="warehouse in warehouses"
                   :key="'warehouse-' + warehouse.x + '' + warehouse.y + '' + warehouse.user_id">
                    <Warehouse :position="{ x: warehouse.x - viewPosition.x, y: warehouse.y - viewPosition.y }"
                               :color="warehouse.color"></Warehouse>
                </g>

            </svg>
        </div>
        <DialogBox v-if="showDialog" @CLOSE="showDialog = false"
                   :latest-clicked-castle="latestClickedCastle"></DialogBox>
        <NavigationBar :activeAction.sync="activeAction"></NavigationBar>
        <TopNavigationBar @OPEN-MENU="menuOpen = true"></TopNavigationBar>
        <Menu v-if="menuOpen" @LOGOUT="logout" @CLOSE-MENU="menuOpen = false"></Menu>
        <ErrorToast v-if="error">{{ error }}</ErrorToast>
        <Popup :zoomFactor="zoomFactor"
               v-if="popupType && popupPosition"
               :type="popupType"
               :item="popupItem"
               :viewPosition="viewPosition"
               :position="popupPosition"
               @ERROR="error = $event"
               @CLOSE="closePopup"></Popup>
        <ActionLog></ActionLog>
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
    import Roads from "./Roads";
    import Popup from "./Popup";
    import Warehouse from "./Warehouse";
    import ActionLog from "./ActionLog";

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
            Roads,
            Popup,
            Warehouse,
            ActionLog
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
                blockAreaSize: config.BLOCK_AREA_SIZE
            };
        },

        computed: {
            roads() {
                const roads = [];
                for (let i = 0; i < this.castles.length; i++) {
                    const c1 = this.castles[i];
                    for (let j = i + 1; j < this.castles.length; j++) {
                        const c2 = this.castles[j];
                        const distanceBetweenCastles = this.$util.positionDistance(c1, c2);
                        if (distanceBetweenCastles < config.MAX_CASTLE_DISTANCE) {
                            const angle = Math.floor(Math.atan2(c2.viewPositionY - c1.viewPositionY, c2.viewPositionX - c1.viewPositionX) * 180 / Math.PI) - 82;
                            const isMyRoad = c1.userId === this.user.id || c2.userId === this.user.id;
                            roads.push({
                                id: c1.x + "-" + c1.y + "-" + c2.x + "-" + c2.y,
                                c1,
                                c2,
                                isMyRoad,
                                middleBetweenCastles: {
                                    x: (c1.viewPositionX + c2.viewPositionX) / 2,
                                    y: (c1.viewPositionY + c2.viewPositionY) / 2
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
                return this.$store.state.warehouses
                    .map(c => {
                        c.viewPositionX = c.x - this.viewPosition.x;
                        c.viewPositionY = c.y - this.viewPosition.y;
                        return c;
                    })
                    .filter(c => {
                        return Boolean(c.viewPositionX > -200 && c.viewPositionX < this.gameWidthWithZoom + 200 && c.viewPositionY > -200 && c.viewPositionY < this.gameHeightWithZoom + 200);
                    });
            },

            catapults() {
                return this.$store.state.catapults
                    .map(c => {
                        c.viewPositionX = c.x - this.viewPosition.x;
                        c.viewPositionY = c.y - this.viewPosition.y;
                        return c;
                    })
                    .filter(c => {
                        return Boolean(c.viewPositionX > -200 && c.viewPositionX < this.gameWidthWithZoom + 200 && c.viewPositionY > -200 && c.viewPositionY < this.gameHeightWithZoom + 200);
                    });
            },
            castles() {

                // TODO: Add clean up of not shown castles... remove them from store... and maybe cache somewhere else.

                return this.$store.state.castles
                    .map(c => {
                        c.viewPositionX = c.x - this.viewPosition.x;
                        c.viewPositionY = c.y - this.viewPosition.y;
                        c.isInConquer = this.$store.state.conquers.some(co => co.castle.x === c.x && co.castle.y === c.y);
                        return c;
                    })
                    .filter(c => {
                        return Boolean(c.viewPositionX > -200 && c.viewPositionX < this.gameWidthWithZoom + 200 && c.viewPositionY > -200 && c.viewPositionY < this.gameHeightWithZoom + 200);
                    });
            },
            blockAreas() {
                return this.$store.state.blockAreas
                    .map(ba => {
                        ba.viewPositionX = ba.x - this.viewPosition.x;
                        ba.viewPositionY = ba.y - this.viewPosition.y;
                        return ba;
                    })
                    .filter(ba => {
                        return Boolean(ba.viewPositionX > -200 && ba.viewPositionX < this.gameWidthWithZoom + 200 && ba.viewPositionY > -200 && ba.viewPositionY < this.gameHeightWithZoom + 200);
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
            }
        },

        watch: {

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

        created() {
            this.$store.dispatch("GET_USER").then(user => {
                this.moveMapTo({x: user.startX, y: user.startY});
                const loadRange = {
                    fromX: user.startX - 500,
                    fromY: user.startY - 500,
                    toX: user.startX + 500,
                    toY: user.startY + 500
                };
                this.$store.dispatch("GET_CASTLES", loadRange);
                this.$store.dispatch("GET_ACTION_LOG", loadRange);
                this.$store.dispatch("GET_CATAPULTS", loadRange);
                this.$store.dispatch("GET_WAREHOUSES", loadRange);
                this.$store.dispatch("GET_CASTLE_PRICE");
                this.$store.dispatch("GET_WAREHOUSE_PRICE");
            });
            this.$store.dispatch("GET_SERVER_VERSION");
            this.$store.dispatch("GET_BLOCK_AREAS");
            this.$store.dispatch("GET_CONQUERS");
        },

        mounted() {
            this.gameHeight = this.$refs["game-container"].offsetHeight;
            this.gameWidth = this.$refs["game-container"].offsetWidth;

            window.addEventListener("resize", this.onWindowResize);

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
            document.removeEventListener("mousewheel", this.onScroll);
            window.removeEventListener("resize", this.onWindowResize);
            this.$refs["game-container"].removeEventListener("mousedown", this.onMouseDown);
            this.$refs["game-container"].removeEventListener("touchstart", this.onMouseDown);
        },

        methods: {

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
                console.log("[Game] Castle click: ", this.user.id, castle.userId);
                if (castle.userId === this.user.id) {
                    this.showDialog = true;
                } else {
                    this.popupType = "castle";
                    this.popupItem = castle;
                    this.popupPosition = {x: castle.viewPositionX, y: castle.viewPositionY - 50};
                }
                this.latestClickedCastle = castle;
            },

            moveMapTo(position) {
                this.viewPosition.x = position.x - window.innerWidth / 2;
                this.viewPosition.y = position.y - window.innerHeight / 2;
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
                if (this.activeAction === "BUILD_CASTLE" || this.menuOpen) return;
                const delta = event.deltaY * config.SCROLL_SENSITIVITY;
                this.zoomFactor = Math.min(1.3, Math.max(0.7, this.zoomFactor + delta));
                if (this.zoomFactor > 0.7 && this.zoomFactor < 1.3) {
                    this.viewPosition.x -= Math.round(delta * this.gameWidth / 2);
                    this.viewPosition.y -= Math.round(delta * this.gameHeight / 2);
                    this.loadCastles();
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
            onMouseMove(event) {
                if (this.waitingForAnimationFrame) return;
                this.waitingForAnimationFrame = true;
                window.requestAnimationFrame(() => {
                    const x = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
                    const y = event.clientY !== undefined ? event.clientY : event.touches[0].clientY;
                    if (this.dragging) {
                        this.viewPosition.x += Math.round((this.lastMousePosition.x - x) * this.zoomFactor);
                        this.viewPosition.y += Math.round((this.lastMousePosition.y - y) * this.zoomFactor);
                    }
                    this.lastMousePosition.x = x;
                    this.lastMousePosition.y = y;
                    this.waitingForAnimationFrame = false;
                });
            },
            onMouseUp() {
                if (this.dragging && Date.now() - this.mouseDownTimestamp > 250) {
                    this.loadCastles();
                    this.loadCatapults();
                    this.loadWarehouses();
                } else if (this.popupType) {
                    this.closePopup();
                }
                this.dragging = false;
            },
            logout() {
                this.websocket.disconnect();
                this.$store.commit("SET_AUTH_TOKEN", "");
                this.$store.commit("SET_USER", undefined);
            },
            loadCastles() {
                this.$store.dispatch("GET_CASTLES", {
                    fromX: this.viewPosition.x,
                    fromY: this.viewPosition.y,
                    toX: Math.floor((this.viewPosition.x + this.gameWidth) * this.zoomFactor),
                    toY: Math.floor((this.viewPosition.y + this.gameHeight) * this.zoomFactor)
                });
            },
            loadCatapults() {
                this.$store.dispatch("GET_CATAPULTS", {
                    fromX: this.viewPosition.x,
                    fromY: this.viewPosition.y,
                    toX: Math.floor((this.viewPosition.x + this.gameWidth) * this.zoomFactor),
                    toY: Math.floor((this.viewPosition.y + this.gameHeight) * this.zoomFactor)
                });
            },
            loadWarehouses() {
                this.$store.dispatch("GET_WAREHOUSES", {
                    fromX: this.viewPosition.x,
                    fromY: this.viewPosition.y,
                    toX: Math.floor((this.viewPosition.x + this.gameWidth) * this.zoomFactor),
                    toY: Math.floor((this.viewPosition.y + this.gameHeight) * this.zoomFactor)
                });
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

    @keyframes pulsate_catapult_ring {
        0% {
            opacity: 0;
        }

        50% {
            opacity: 0.7;
        }

        100% {
            opacity: 0;
        }
    }

    .catapult-ring {
        opacity: 1;
        animation: pulsate_catapult_ring;
        animation-iteration-count: infinite;
        animation-duration: 3.2s;
        animation-timing-function: ease-out;
    }
</style>
