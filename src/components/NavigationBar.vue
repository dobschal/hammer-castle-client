<template>

    <!-- TODO: Hide that and show only the list of buttons when clicked a little plus button at the bottom -->

    <div class="wrapper">
        <div class="buttons">
            <button v-if="activeAction && isTouchDevice" type="button" @click="buildIt">Build It</button>
            <button v-if="activeAction" type="button" class="negative" @click="cancel">Cancel</button>
            <button v-else type="button" @click="buildCastle">Build Castle for {{ $store.state.castlePrice }} <img
                    src="../assets/icon-hammer.svg" class="hammer-icon" alt="Hammer"></button>

        </div>
    </div>
</template>

<script>
    export default {
        name: "NavigationBar",
        props: {
            activeAction: String
        },
        data() {
            return {
                isTouchDevice: false
            };
        },
        created() {
            document.addEventListener("touchstart", this.onTouchStart);
        },
        beforeDestroy() {
            document.removeEventListener("touchstart", this.onTouchStart);
        },
        methods: {
            cancel() {
                this.$emit("update:activeAction", "")
            },
            buildCastle() {
                this.$emit("update:activeAction", "BUILD_CASTLE");
            },
            onTouchStart() {
                this.isTouchDevice = true;
            },
            buildIt() {
                this.$emit("BUILD_IT");
            }
        }
    };
</script>

<style lang="scss" scoped>
    .wrapper {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        z-index: 2;
        width: 320px;
        margin-left: -160px;
        text-align: center;
    }
    button {
        padding: 0 1.5rem;
        line-height: 40px;
    }
    .hammer-icon {
        display: inline-block;
        margin-bottom: -9px;
        margin-right: -10px;
        width: 32px;
    }
</style>
