<template>
    <div class="error-toast" @click="$emit('CLICK')">
        ~ Error ~<br>
        <slot class="content"></slot>
    </div>
</template>

<style lang="scss" scoped>
    .error-toast {
        position: fixed;
        z-index: 9;
        left: 50%;
        top: 50%;
        font-family: 'Piazzolla', serif;
        color: white;
        font-weight: bold;
        background-color: rgba(144, 19, 0, 0.8);
        backdrop-filter: blur(15px);
        padding: 1rem;
        border-radius: 0.5rem;
        border: solid 1px rgba(144, 19, 0, 0.3);
        box-shadow: 0 25px 25px -17px rgba(0, 0, 0, 0.5), 0 0 50px rgba(0, 0, 0, 0.3);
        width: 240px;
        text-align: center;
        transform: translateY(-50px) translateX(-120px);
        box-sizing: border-box;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;

        &:hover {
            cursor: pointer;
            background-color: rgba(144, 19, 0, 0.75);
        }
    }
</style>
