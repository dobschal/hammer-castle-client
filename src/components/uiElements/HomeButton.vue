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
        background-color: rgba(11, 90, 102, 0.5);
        backdrop-filter: blur(5px);
        border-radius: 1rem;
        width: calc(32px + 0.8rem);
        height: 54px;
        transition: transform 0.3s ease-out;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;

        &:hover, &:active {
            transform: scale(1.1);
            cursor: pointer;
        }
    }
</style>
