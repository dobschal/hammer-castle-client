<template>
    <div class="popup"
         @mouseup.stop
         @touchend.stop
         :style="{ left: ((position.x - viewPosition.x) / zoomFactor) + 'px', top: ((position.y - viewPosition.y) / zoomFactor) + 'px', transform: 'translateX(' + (-mouseMoveDelta.x) + 'px) translateY(' + (-mouseMoveDelta.y) + 'px)' }">
        <div class="items" v-if="type === 'road'">
            <div v-if="canBuildCatapult" class="item" @click="buildCatapult"
                 v-tooltip="'A catapult is going to attack the opponents castle. There is a possibility that the opponents castle gets destroyed or the catapult remains unaffected.'">
                Build Catapult for <br>{{ catapultPrice }} <img src="../assets/icon-hammer.svg" class="hammer-icon"
                                                                alt="Hammer">
            </div>
            <div v-else-if="canBuildWarehouse"
                 class="item"
                 @click="buildWarehouse"
                 v-tooltip="'A warehouse will increase the amount of hammers you can store.'">
                Build Warehouse for <br>{{ warehousePrice }} <img src="../assets/icon-hammer.svg" class="hammer-icon"
                                                                  alt="Hammer">
            </div>
            <div v-else class="item inactive">Catapults need to be on a road next to an opponents Castle.</div>
        </div>
        <div class="items" v-else-if="type === 'castle' && !isMyCastle">
            <div class="item no-link">{{ item.username }}</div>
            <div class="item inactive">{{ Math.floor(item.x) }} / {{ Math.floor(item.y) }}</div>
            <div class="item no-link" v-if="item.isOnline !== undefined" :class="{ positive: item.isOnline }">{{
                item.isOnline ?
                'User is online' : 'Not online'
                }}
            </div>
        </div>
        <div class="items" v-else-if="type === 'castle' && isMyCastle">
            <div class="item">Build Knight</div>
            <div class="item" @click="$emit('update:type', 'castle-change-name')">Change Name</div>
            <div class="item" @click="deleteCastle">Destroy</div>
        </div>
        <div class="items" v-else-if="type === 'warehouse'">
            <div class="item inactive">You have {{ warehouseAmount }} warehouses.</div>
            <div v-if="item.level === 1" @click="upgradeWarehouse" class="item"
                 v-tooltip="'Warehouses level 2 allow you to store gold.'">Upgrade Warehouse for<br> {{ warehousePrice
                }} <img src="../assets/icon-hammer.svg" class="hammer-icon"
                        alt="Hammer"></div>
            <div v-else class="item inactive">The warehouse is already at the max level.</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Popup",
        props: {
            type: String,
            item: Object, // depending on type ... might be a road or castle
            zoomFactor: Number,
            viewPosition: Object,
            mouseMoveDelta: Object,
            position: Object // x, y
        },
        computed: {
            warehousePrice() {
                return this.$store.state.warehousePrice;
            },
            warehouseAmount() {
                return this.$store.state.warehouseAmount;
            },
            catapultPrice() {
                return this.$store.state.catapultPrice;
            },
            user() {
                return this.$store.state.user;
            },
            isMyCastle() {
                return this.type === "castle" && this.item.userId === this.user.id;
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
            }
        },
        mounted() {
            if (this.type === "castle") {
                this.$store.dispatch("IS_ONLINE", this.item.username).then(isOnline => {
                    this.$set(this.item, "isOnline", isOnline);
                    console.log("[Popup] Got online state: ", isOnline);
                });
            } else if (this.type === "warehouse") {
                this.$store.dispatch("GET_WAREHOUSE_AMOUNT", {x: this.item.x, y: this.item.y});
            }
        },
        methods: {
            async deleteCastle() {

                // TODO: Error handling and dialog?

                await this.$store.dispatch("DELETE_CASTLE", {
                    x: this.item.x,
                    y: this.item.y
                });
                await this.$store.dispatch("GET_CASTLE_PRICE");
                await this.$store.dispatch("GET_CATAPULT_PRICE");
                await this.$store.dispatch("GET_WAREHOUSE_PRICE");
                this.$emit("CLOSE");
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
                        x: this.item.middleBetweenCastles.x,
                        y: this.item.middleBetweenCastles.y
                    });
                    await this.$store.dispatch("GET_CATAPULT_PRICE");
                } catch (e) {
                    this.$emit("ERROR", e.response.data.message);
                }
                this.$emit("CLOSE");
            },
            async buildWarehouse() {
                if (!this.canBuildWarehouse) return this.$emit("ERROR", "Wrong position for a warehouse...");
                try {
                    await this.$store.dispatch("CREATE_WAREHOUSE", {
                        castle1X: this.item.c1.x,
                        castle1Y: this.item.c1.y,
                        castle2X: this.item.c2.x,
                        castle2Y: this.item.c2.y,
                        x: this.item.middleBetweenCastles.x,
                        y: this.item.middleBetweenCastles.y
                    });
                    await this.$store.dispatch("GET_WAREHOUSE_PRICE");
                } catch (e) {
                    this.$emit("ERROR", e.response.data.message);
                }
                this.$emit("CLOSE");
            },
            async upgradeWarehouse() {
                try {
                    await this.$store.dispatch("UPGRADE_WAREHOUSE", {
                        x: this.item.x,
                        y: this.item.y
                    });
                    await this.$store.dispatch("GET_WAREHOUSE_PRICE");
                } catch (e) {
                    this.$emit("ERROR", e.response.data.message);
                }
                this.$emit("CLOSE");
            }
        }
    }
</script>

<style lang="scss" scoped>

    .hammer-icon {
        display: inline-block;
        margin-bottom: -9px;
        margin-right: -10px;
        width: 24px;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
    }

    .popup {
        position: fixed;
        left: 50%;
        top: 50%;
        // transform: translateY(-170px) translateX(-117px);
        margin-top: -200px;
        margin-left: -155px;
        width: 320px;
        height: 195px;
        z-index: 3;
        background-image: url("../assets/popup.svg");
        background-size: 100% auto;
        background-position: center 0;
        background-repeat: no-repeat;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;

        .items {
            padding-top: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            justify-items: center;
            height: calc(100% - 4.5rem);

            .item {
                text-align: center;
                color: white;
                font-size: 1rem;
                font-weight: bold;
                letter-spacing: 1.4px;
                border-bottom: dashed 2px rgba(255, 255, 255, 0.2);
                margin: 0 3rem;
                padding: .2rem 0;

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
