<template>
    <div class="wrapper">
        <div class="buttons">
            <button v-if="activeAction" type="button" @click="cancel">Cancel</button>
            <button v-else type="button" @click="buildCastle">Build Castle for {{ $store.state.castlePrice }}</button>

        </div>
    </div>
</template>

<script>
    export default {
        name: "NavigationBar",
        props: {
            activeAction: String
        },
        methods: {
            cancel() {
                this.$emit("update:activeAction", "")
            },
            buildCastle() {
                console.log("[NavigationBar] Click build castle: ");
                this.$emit("update:activeAction", "BUILD_CASTLE");
            }
        }
    };
</script>

<style lang="scss" scoped>
    .wrapper {
        position: fixed;
        bottom: 4rem;
        left: 50%;
        z-index: 2;
        width: 320px;
        margin-left: -160px;
        text-align: center;
    }
</style>
