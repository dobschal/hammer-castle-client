<template>
    <div class="daily-reward"
         :class="{ active: active }"
         @click="claimDailyReward"
         v-tooltip="{ content: 'Claim your daily reward: <br><br>Your storage will be filled up with hammers and you get a beer for free !!!', html: true }">
        <span class="count-down" v-if="user && !active" v-tooltip="'You can claim your daily reward once in 24 hours.'">{{ countDown }}</span>
    </div>
</template>

<script>
    export default {
        name: "DailyReward",
        computed: {
            user() {
                return this.$store.state.user;
            },
            active() {
                return this.user && this.user.last_daily_reward_claim < Date.now() - 1000 * 60 * 60 * 24;
            }
        },
        data() {
            return {countDown: 0, intervalId: undefined};
        },
        created() {
            this.intervalId = setInterval(() => {
                if (!this.user) return;
                let seconds = Math.max(0, Math.floor(((this.user.last_daily_reward_claim + 1000 * 60 * 60 * 24) - Date.now()) / 1000));
                let minutes = Math.floor(seconds / 60) || 0;
                const hours = Math.floor(minutes / 60) || 0;
                seconds = seconds % 60;
                minutes = minutes % 60;
                this.countDown = `${hours < 10 ? ('0' + hours) : hours}:${minutes < 10 ? ('0' + minutes) : minutes}:${seconds < 10 ? ('0' + seconds) : seconds}`;
            }, 1000);
        },
        beforeDestroy() {
            if (this.intervalId) clearInterval(this.intervalId);
        },
        methods: {
            claimDailyReward() {
                if(!this.active) return;
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
        top: 19.5rem;
        z-index: 3;
        background-image: url("../../assets/icon-gift.png");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        background-color: rgba(255, 109, 105, 0.35);
        border-radius: 50%;
        width: 60px;
        height: 60px;
        opacity: 0.8;

        &.active {
            opacity: 1.0;
            pointer-events: initial;

            &:hover {
                cursor: pointer;
                animation: shake;
                animation-iteration-count: infinite;
                animation-duration: 1s;
                animation-timing-function: ease-out;
            }
        }

        .count-down {
            color: white;
            font-family: 'Piazzolla', serif;
            font-size: 0.8rem;
            margin-top: -22px;
            display: block;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            box-sizing: border-box;
            letter-spacing: 0;
            text-align: center;
        }
    }
</style>
