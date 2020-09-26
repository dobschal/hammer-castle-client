<template>
    <div class="popup" @mouseup.stop
         :style="{ left: (position.x / zoomFactor) + 'px', top: (position.y / zoomFactor) + 'px' }">
        <div class="items" v-if="type === 'road'">
            <div v-if="canBuildCatapult" class="item" @click="buildCatapult">Build a Catapult</div>
            <div v-else-if="canBuildWarehouse" class="item" @click="buildWarehouse">Build a Warehouse</div>
            <div v-else class="item inactive">Catapults need to be on a road next to an opponents Castle.</div>
        </div>
        <div class="items" v-else-if="type === 'castle'">
            <div class="item">{{ item.username }}</div>
            <div class="item">{{ item.x }} / {{ item.y }}</div>
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
            position: Object // x, y
        },
        computed: {
            user() {
                return this.$store.state.user;
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
            console.log("[Popup] mounted yeah: ");
        },
        methods: {
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
                        x: this.item.middleBetweenCastles.x + this.viewPosition.x,
                        y: this.item.middleBetweenCastles.y + this.viewPosition.y
                    });
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
                        x: this.item.middleBetweenCastles.x + this.viewPosition.x,
                        y: this.item.middleBetweenCastles.y + this.viewPosition.y
                    });
                } catch (e) {
                    this.$emit("ERROR", e.response.data.message);
                }
                this.$emit("CLOSE");
            }
        }
    }
</script>

<style lang="scss" scoped>
    .popup {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translateY(-170px) translateX(-117px);
        width: 234px;
        height: 173px;
        z-index: 3;
        background-image: url("../assets/popup.svg");
        background-size: 100%;
        background-position: center 30px;
        background-repeat: no-repeat;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;

        .items {
            padding-top: 3rem;

            .item {
                text-align: center;
                color: white;
                font-size: 1rem;
                font-weight: bold;
                letter-spacing: 1.4px;
                border-bottom: dashed 2px rgba(255, 255, 255, 0.5);
                margin: 0 2.75rem;
                padding-bottom: .25rem;

                &.inactive {
                    border: none;
                    font-size: 0.9rem;

                    &:hover {
                        color: white;
                        cursor: initial;
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
