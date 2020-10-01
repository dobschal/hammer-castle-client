<template>
    <div class="daily-reward"
         @click="claimDailyReward"
         v-tooltip="{ content: 'Claim your daily reward: <br><br><i>Your storage will be filled up with hammers for free !!!</i>', html: true }"></div>
</template>

<script>
    export default {
        name: "DailyReward",
        methods: {
            claimDailyReward() {
                this.$store.dispatch("CLAIM_DAILY_REWARD");
            }
        }
    };
</script>

<style lang="scss" scoped>
    @keyframes shake {
        0% {
            transform: rotate(0deg) scale(1);
        }
        30% {
            transform: rotate(30deg) scale(0.95);
        }
        70% {
            transform: rotate(-15deg) scale(1.05);
        }
        100% {
            transform: rotate(0deg) scale(1);
        }
    }

    .daily-reward {
        position: fixed;
        right: 1rem;
        top: 45%;
        z-index: 3;
        background-image: url("../assets/icon-gift.png");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        width: 60px;
        height: 60px;


        &:hover {
            cursor: pointer;
            animation: shake;
            animation-iteration-count: infinite;
            animation-duration: 1s;
            animation-timing-function: ease-out;
        }
    }
</style>
