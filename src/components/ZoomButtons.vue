<template>
    <div class="zoom-buttons">
        <div class="zoom-in" @click="$emit('ZOOM_IN')"></div>
        <div class="zoom-out" @click="$emit('ZOOM_OUT')"></div>
    </div>
</template>

<style lang="scss" scoped>
    .zoom-buttons {
        position: fixed;
        right: 1.5rem;
        top: 5rem;
        z-index: 3;
        /*background-image: url("../assets/icon-gift.png");*/
        /*background-size: contain;*/
        /*background-position: center;*/
        /*background-repeat: no-repeat;*/
        background-color: rgba(8, 49, 57, 0.15);
        backdrop-filter: blur(5px);
        border-radius: 1rem;
        width: calc(32px + 0.8rem);
        opacity: 1;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;

        .zoom-in {
            background-image: url("../assets/icon-zoom-in.svg");
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            width: 32px;
            height: 32px;
            margin: 0.5rem auto;
            transition: transform 0.3s ease-out;

            &:hover, &:active {
                transform: scale(1.4);
                cursor: pointer;
            }
        }

        .zoom-out {
            background-image: url("../assets/icon-zoom-out.svg");
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            width: 32px;
            height: 32px;
            margin: 1.2rem auto 0.5rem auto;
            transition: transform 0.3s ease-out;

            &:hover, &:active {
                cursor: pointer;
                transform: scale(1.4);
            }
        }
    }
</style>
