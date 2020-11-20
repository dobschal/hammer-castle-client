<template>
    <div class="open-friends-button" @click="$emit('OPEN')">
    </div>
</template>

<script>
    export default {
        name: "OpenFriendsButton"
    };
</script>

<style lang="scss" scoped>
    .open-friends-button {
        position: fixed;
        right: 1rem;
        top: 21.4rem;
        z-index: 3;
        background-image: url("../../assets/icon-friends.svg");
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

        @media only screen and (max-width: 900px) {
            top: 17.4rem;
        }

        &:hover, &:active {
            transform: scale(1.1);
            cursor: pointer;
        }
    }
</style>
