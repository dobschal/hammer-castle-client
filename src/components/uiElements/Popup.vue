<template>
    <div class="popup"
         @mouseup.stop
         @touchend.stop
         :style="{ left: ((position.x - viewPosition.x) / zoomFactor) + 'px', top: ((position.y - viewPosition.y) / zoomFactor) + 'px', transform: 'translateX(' + (-mouseMoveDelta.x) + 'px) translateY(' + (-mouseMoveDelta.y) + 'px)' }">
        <span class="title" v-html="title"></span>
        <div class="items" v-if="type === 'castle-change-name'">
            <form @submit.prevent="changeCastleName">
                <label>
                    Enter a new name for your castle:
                    <input type="text" v-model="newCastleName" placeholder="New castle name..." autofocus/>
                </label>
                <button type="submit">Save</button>
            </form>
        </div>
        <div class="items" v-else-if="type === 'road'">
            <div v-if="canBuildCatapult" class="item" @click="buildCatapult"
                 v-tooltip="'A catapult is going to attack the opponents castle. There is a possibility that the opponents castle gets destroyed or the catapult remains unaffected.'">
                Build Catapult for <br>{{ catapultPrice }} <img src="../../assets/icon-hammer.svg" class="hammer-icon"
                                                                alt="Hammer">
            </div>
            <div v-else-if="canBuildWarehouse"
                 class="item"
                 @click="buildWarehouse"
                 v-tooltip="'A warehouse will increase the amount of hammers you can store.'">
                Build Warehouse <br>for {{ warehousePrice }} <img src="../../assets/icon-hammer.svg" class="hammer-icon"
                                                                  alt="Hammer">
            </div>
            <div v-else class="item inactive">Catapults need to be on a road next to an opponents Castle.</div>
        </div>
        <div class="items" v-else-if="type === 'castle' && !isMyCastle">
            <div class="item no-link">{{ item.username }}<br>
                <small v-if="item.isOnline !== undefined" :class="{ positive: item.isOnline }">
                    {{
                    item.isOnline ?
                    'User is online' : 'Not online'
                    }}
                </small>
            </div>
            <div class="item inactive">Position: <br>{{ Math.floor(item.x) }} / {{ Math.floor(item.y) }}</div>
            <div class="item inactive">
                Built at:
                <DateView :timestamp="Date.parse(item.timestamp.replace(' ', 'T') + '.000Z')"></DateView>
            </div>
        </div>
        <div class="items" v-else-if="type === 'castle' && isMyCastle">
            <div class="item" @click="buildKnight" :class="{ 'no-link': !canBuildKnight}">
                Build Knight<br><small>for {{ knightPrice }} <img src="../../assets/icon-hammer.svg" class="hammer-icon"
                                                                  alt="Hammer"></small>
            </div>
            <div class="item" @click="markAsHome">Mark as Home</div>
            <div class="item" @click="$emit('update:type', 'castle-change-name')">Change Name</div>
            <div class="item" @click="deleteCastle">Destroy</div>
        </div>
        <div class="items" v-else-if="type === 'knight' && isMyKnight">
            <div class="item" @click="$emit('MOVE_KNIGHT', item)">Move</div>
            <div class="item">Level Up</div>
            <div class="item">Change Name</div>
            <div class="item">Destroy</div>
        </div>
        <div class="items" v-else-if="type === 'warehouse'">
            <div class="item inactive">You have {{ warehouseAmount }} warehouses.</div>
            <div v-if="item.level === 1"
                 @click="upgradeWarehouse"
                 class="item"
                 v-tooltip="'Warehouses level 2 allow you to store gold.'">
                Upgrade Warehouse for<br>
                {{ warehouseUpgradePrice }}
                <img src="../../assets/icon-hammer.svg" class="hammer-icon" alt="Hammer">
            </div>
            <div v-else class="item inactive">The warehouse is already at the max level.</div>
        </div>
    </div>
</template>

<script>
    import DateView from "../DateView";

    export default {
        name: "Popup",
        components: {DateView},
        props: {
            type: String,
            item: Object, // depending on type ... might be a road or castle
            zoomFactor: Number,
            viewPosition: Object,
            mouseMoveDelta: Object,
            position: Object // x, y
        },
        computed: {
            title() {
                if (!this.item) return "";
                switch (this.type) {
                    case "road":
                        return "~ Road ~<br><small>at " + Math.floor(this.position.x) + "/" + Math.floor(this.position.y) + "</small>";
                    case "castle-change-name":
                    case "castle":
                        return "~ Castle ~<br><small>'" + this.item.name + "'</small>";
                    case "warehouse":
                        return "~ Warehouse ~<br><small>at " + Math.floor(this.position.x) + "/" + Math.floor(this.position.y) + "</small>";
                    case "knight":
                        return "~ Knight ~<br><small>level " + this.item.level + "</small>";
                    default:
                        return "";
                }
            },
            warehousePrice() {
                return this.$store.state.warehousePrice;
            },
            warehouseUpgradePrice() {
                return this.$store.state.warehouseUpgradePrice;
            },
            warehouseAmount() {
                return this.$store.state.warehouseAmount;
            },
            catapultPrice() {
                return this.$store.state.catapultPrice;
            },
            knightPrice() {
                return this.$store.state.knightPrice;
            },
            user() {
                return this.$store.state.user;
            },
            isMyCastle() {
                return this.type === "castle" && this.item.userId === this.user.id;
            },
            isMyKnight() {
                return this.type === "knight" && this.item.userId === this.user.id;
            },

            //  the user can build a catapult on a road between an owned castle and an opponents castle...
            canBuildCatapult() {
                if (this.type !== "road") return false;

                // one of two castles is mine?
                return [this.item.c1, this.item.c2].filter(castle => castle.userId === this.user.id).length === 1;
            },
            canBuildWarehouse() {
                if (this.type !== "road") return false;
                return [this.item.c1, this.item.c2].filter(castle => castle.userId === this.user.id).length === 2;
            },
            canBuildKnight() {
                if (this.type !== "castle") return false;
                return this.item.points >= 5;
            }
        },
        data() {
            return {
                newCastleName: ""
            };
        },
        mounted() {
            if (this.type === "castle") {
                this.newCastleName = this.item.name;
                this.$store.dispatch("IS_ONLINE", this.item.username).then(isOnline => {
                    this.$set(this.item, "isOnline", isOnline);
                });
            } else if (this.type === "warehouse") {
                this.$store.dispatch("GET_WAREHOUSE_AMOUNT", {x: this.item.x, y: this.item.y});
            }
        },
        methods: {
            async markAsHome() {
                try {
                    await this.$store.dispatch("MARK_AS_HOME", {
                        x: this.item.x,
                        y: this.item.y
                    });
                    this.$emit("CLOSE");
                } catch (e) {
                    this.$emit("ERROR", e.response.data.message);
                }
            },
            async buildKnight() {
                if (!this.canBuildKnight) return this.$emit("ERROR", "Knights can be build in castles level 5 or greater.");
                try {
                    await this.$store.dispatch("CREATE_KNIGHT", {
                        x: this.item.x,
                        y: this.item.y
                    });
                    await this.$store.dispatch("GET_KNIGHT_PRICE");
                    this.$emit("CLOSE");
                } catch (e) {
                    this.$emit("ERROR", e.response.data.message);
                }
            },
            async changeCastleName() {
                if (!this.newCastleName || this.newCastleName.length > 12) {
                    this.$emit("ERROR", "Please insert a valid castle name! Max length is 12 characters.");
                    return;
                }
                console.log("[Popup] New castle name for: ", this.input, this.latestClickedCastle);
                try {
                    await this.$store.dispatch("CHANGE_CASTLE_NAME", {
                        x: this.item.x,
                        y: this.item.y,
                        name: this.newCastleName
                    });
                    this.$emit("CLOSE");
                } catch (e) {
                    this.$emit("ERROR", e.response.data.message);
                }
            },
            async deleteCastle() {
                try {
                    await this.$store.dispatch("DELETE_CASTLE", {
                        x: this.item.x,
                        y: this.item.y
                    });
                    await this.$store.dispatch("GET_CASTLE_PRICE");
                    await this.$store.dispatch("GET_CATAPULT_PRICE");
                    await this.$store.dispatch("GET_WAREHOUSE_PRICE");
                    this.$emit("CLOSE");
                } catch (e) {
                    this.$emit("ERROR", e.response.data.message);
                }
            },
            async buildCatapult() {
                if (!this.canBuildCatapult) return this.$emit("ERROR", "Wrong position for a catapult...");
                try {
                    const userCastle = this.item.c1.userId === this.user.id ? this.item.c1 : this.item.c2;
                    const opponentCastle = this.item.c1.userId === this.user.id ? this.item.c2 : this.item.c1;
                    await this.$store.dispatch("CREATE_CATAPULT", {
                        opponentCastleX: opponentCastle.x,
                        opponentCastleY: opponentCastle.y,
                        userCastleX: userCastle.x,
                        userCastleY: userCastle.y,
                        x: this.item.x,
                        y: this.item.y
                    });
                    await this.$store.dispatch("GET_CATAPULT_PRICE");
                    this.$emit("CLOSE");
                } catch (e) {
                    this.$emit("ERROR", e.response.data.message);
                }
            },
            async buildWarehouse() {
                if (!this.canBuildWarehouse) return this.$emit("ERROR", "Wrong position for a warehouse...");
                try {
                    await this.$store.dispatch("CREATE_WAREHOUSE", {
                        castle1X: this.item.c1.x,
                        castle1Y: this.item.c1.y,
                        castle2X: this.item.c2.x,
                        castle2Y: this.item.c2.y,
                        x: this.item.x,
                        y: this.item.y
                    });
                    await this.$store.dispatch("GET_WAREHOUSE_PRICE");
                    this.$emit("CLOSE");
                } catch (e) {
                    this.$emit("ERROR", e.response.data.message);
                }
            },
            async upgradeWarehouse() {
                try {
                    await this.$store.dispatch("UPGRADE_WAREHOUSE", {
                        x: this.item.x,
                        y: this.item.y
                    });
                    await this.$store.dispatch("GET_WAREHOUSE_PRICE");
                    this.$emit("CLOSE");
                } catch (e) {
                    this.$emit("ERROR", e.response.data.message);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

    .hammer-icon {
        display: inline-block;
        margin-bottom: -7px;
        margin-right: -10px;
        width: 24px;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
    }

    small > .hammer-icon {
        width: 20px;
    }

    .popup {
        position: fixed;
        left: 50%;
        top: 50%;
        // transform: translateY(-170px) translateX(-117px);
        margin-top: -250px;
        margin-left: -115px;
        width: 240px;
        height: 255px;
        z-index: 3;
        background-image: url("../../assets/popup-long.png");
        background-size: 100% auto;
        background-position: center 0;
        background-repeat: no-repeat;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;

        .error {
            color: #ff553e;
            font-family: 'Piazzolla', serif;
            line-height: 1.1rem;
            letter-spacing: 0;
            margin: 0 3rem;
        }

        .title {
            color: white;
            display: block;
            text-align: center;
            padding-top: 1.2rem;
            padding-bottom: 0.35rem;
            margin: 0 2rem;
            white-space: nowrap;
            border-bottom: solid 2px rgba(255, 244, 246, 0.1);
            font-weight: bold;
        }

        .items {
            padding: 0.5rem 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            justify-items: center;
            height: calc(100% - 6.2rem);
            box-sizing: border-box;

            label {
                color: white;
                font-size: 0.85rem;
                font-weight: bold;
                display: block;
                margin: 0 3rem;
                text-align: center;

                input {
                    width: 100%;
                    box-sizing: border-box;
                    border: solid 1px rgba(255, 255, 255, 0.52);
                    background-color: rgba(255, 255, 255, 0.54);
                    color: black;
                    padding: 8px;
                    margin: 0.5rem 0;
                    border-radius: 5px;
                }
            }

            button {
                width: calc(100% - 6rem);
                margin: 0.5rem 3rem;
            }

            .item {
                text-align: center;
                color: white;
                font-size: 1rem;
                font-weight: bold;
                letter-spacing: 1.4px;
                border-bottom: dashed 2px rgba(255, 255, 255, 0.2);
                margin: 0 3rem;
                padding-bottom: .3rem;

                &.positive {
                    color: #b6e57b;
                }

                /*&:last-child {*/
                /*    border: none;*/
                /*}*/

                &.inactive {
                    border: none;
                    font-size: 0.85rem;
                    opacity: 0.8;

                    &:hover {
                        color: white !important;
                        cursor: initial !important;
                    }
                }

                &.no-link {
                    border: none;
                    opacity: 0.8;

                    &:hover {
                        color: white !important;
                        cursor: initial !important;
                    }
                }

                &:hover {
                    color: red;
                    cursor: pointer;
                }
            }
        }
    }
</style>
