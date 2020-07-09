<template>
    <div class="wrapper">
        <div class="buttons">
            <button type="button" @click="buildCastle">Build Castle</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NavigationBar",
        methods: {
            buildCastle() {
                console.log("[NavigationBar] Click build castle: ");
                this.$emit("build-castle");
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
        background-color: red;
    }
</style>
