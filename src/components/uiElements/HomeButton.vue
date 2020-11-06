<template>
    <div class="home-button" @click="$emit('GO_HOME')">
    </div>
</template>

<script>
    export default {
        name: "HomeButton"
    };
</script>

<style lang="scss" scoped>
    .home-button {
        position: fixed;
        right: 1rem;
        top: 11.7rem;
        z-index: 3;
        background-image: url("../../assets/icon-home.svg");
        background-size: 32px 32px;
        background-position: center;
        background-repeat: no-repeat;
        background-color: rgba(8, 49, 57, 0.3);
        backdrop-filter: blur(5px);
        border-radius: 1rem;
        width: calc(32px + 0.8rem);
        height: 54px;
        transition: transform 0.3s ease-out;

        &:hover, &:active {
            transform: scale(1.4);
            cursor: pointer;
        }
    }
</style>
