<template>
    <div class="open-quest-button" @click="$emit('OPEN')">
        <span v-if="hasBadge" class="badge">1</span>
    </div>
</template>

<script>
    export default {
        name: "OpenQuestButton",
        computed: {
            hasBadge() {
                return this.$store.state.quests.some(quest => quest.status.includes("NEW"));
            }
        }
    };
</script>

<style lang="scss" scoped>
    .open-quest-button {
        position: fixed;
        right: 1rem;
        top: 16.5rem;
        z-index: 3;
        background-image: url("../../assets/icon-tied-scroll.svg");
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
            top: 13.5rem;
        }

        &:hover, &:active {
            transform: scale(1.1);
            cursor: pointer;
        }

        .badge {
            width: 20px;
            height: 20px;
            display: block;
            background: rgba(255, 30, 15, 0.9);
            backdrop-filter: blur(5px);
            border-radius: 50%;
            margin: -5px 0 0 -5px;
            color: white;
            text-align: center;
            line-height: 20px;
            font-weight: bold;
            box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.33);
        }
    }
</style>
