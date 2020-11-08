<template>
    <div class="wrapper">
        <div class="buttons">
            <div class="icon-value-pair">
                <span class="icon" :class="{ animated: gotHammer }"><img src="../../assets/icon-hammer.svg"
                                                                         alt="Hammer"></span>
                <span class="value">{{ hammer }}<span class="small">/{{ maxHammers }}</span></span>
                <div class="nav-tooltip">
                    <div class="nav-tooltip-content">
                        <div class="key-value-pair">
                            <span class="icon"><img
                                    src="../../assets/icon-hammer-plus.svg"
                                    alt="Hammer Per Minute"></span>
                            <p class="content">{{ hammerPerMinute }}<span
                                    class="small">/min</span></p>
                        </div>
                        <div class="text">Hammer are produced by castles and
                            stored in warehouses.
                        </div>
                    </div>
                </div>
            </div>
            <div class="icon-value-pair">
                <span class="icon"><img src="../../assets/icon-beer.svg"
                                        alt="beer"></span>
                <span class="value">{{ beer }}<span
                        class="small">/{{ maxBeer }}</span></span>
                <div class="nav-tooltip">
                    <div class="nav-tooltip-content">
                        <div class="key-value-pair">
                            <span class="icon"><img
                                    src="../../assets/icon-hammer-plus.svg"
                                    alt="Beer Per Minute"></span>
                            <p class="content">{{ hammerPerMinute }}<span
                                    class="small">/min</span></p>
                        </div>
                        <div class="text">Beer is produced by castles level 5+
                            and consumed by knights. Do always have enough beer!
                        </div>
                    </div>
                </div>
            </div>
            <div class="icon-value-pair">
                <span class="icon"><img src="../../assets/icon-level.svg" alt="Level"></span>
                <span class="value">{{ level }}</span>
                <div class="nav-tooltip">
                    <div class="nav-tooltip-content">
                        <div class="text">Your level. Base for the hammer castle player ranking.
                        </div>
                    </div>
                </div>
            </div>
            <div class="icon-value-pair" @click="openMenu">
                <span class="icon burger-button"><img src="../../assets/icon-burger.svg" alt="Menu"></span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TopNavigationBar",
        computed: {
            hammer() {
                return this.$store.state.user ? this.$store.state.user.hammer : 0;
            },
            maxHammers() {
                return this.$store.state.user ? this.$store.state.user.maxHammers : 0;
            },
            hammerPerMinute() {
                return this.$store.state.user ? this.$store.state.user.hammerPerMinute : 0;
            },
            level() {
                return this.$store.state.user ? this.$store.state.user.level : 0;
            },
            username() {
                return this.$store.state.user ? this.$store.state.user.username : "Unknown";
            },
            beer() {
                return this.$store.state.user ? this.$store.state.user.beer : 0;
            },
            maxBeer() {
                return this.$store.state.user ? this.$store.state.user.maxBeer : 0;
            }
        },
        watch: {
            hammer() {
                if (this.timeoutId) clearTimeout(this.timeoutId);
                this.gotHammer = true;
                this.timeoutId = setTimeout(() => {
                    this.gotHammer = false;
                }, 2000);
            }
        },
        data() {
            return {
                gotHammer: false,
                timeoutId: undefined
            };
        },
        methods: {
            openMenu() {
                this.$emit("OPEN-MENU");
            }
        }
    };
</script>

<style lang="scss" scoped>
    @keyframes rotate {
        0% {
            transform: rotate(0deg) scale(1.0);
        }
        50% {
            transform: rotate(40deg) scale(1.5);
        }
        100% {
            transform: rotate(0deg) scale(1.0);
        }
    }

    .wrapper {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 4;
        width: 100vw;
        margin-left: 0;
        text-align: center;
        background: rgba(11, 90, 102, 0.7);
        backdrop-filter: blur(5px);

        .buttons {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin: 0 auto;
            max-width: 400px;
            padding: 0 1rem;

            .icon-value-pair {
                position: relative;
                padding: 0 0;
                border-radius: 8px;
                display: flex;
                flex-direction: row;
                align-items: center;
                height: 40px;
                white-space: nowrap;
                -webkit-touch-callout: none; /* iOS Safari */
                -webkit-user-select: none; /* Safari */
                -khtml-user-select: none; /* Konqueror HTML */
                -moz-user-select: none; /* Old versions of Firefox */
                -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none;

                &:first-child {
                    .icon {
                        width: 32px;
                    }
                }

                &:nth-child(2) {
                    .icon {
                        width: 32px;
                        margin-right: 4px;
                        margin-top: 6px;
                    }
                }

                &:nth-child(3) {
                    .icon {
                        width: 24px;
                        margin-right: 4px;
                    }
                }

                &:nth-child(4) {
                    .icon {
                        margin-top: 2px;
                        width: 24px;
                    }
                }

                .icon {
                    width: 40px;
                    display: block;
                    margin: auto;

                    &.animated {
                        animation: rotate;
                        animation-iteration-count: infinite;
                        animation-timing-function: ease-in-out;
                        animation-duration: 2s;
                    }

                    img {
                        width: 100%;
                    }
                }

                .value {
                    margin: auto;
                    color: white;
                    display: block;
                    letter-spacing: 0;

                    .small {
                        font-size: 50%;
                        letter-spacing: 1px;
                    }
                }

                .burger-button {
                    transition: transform 0.3s ease-out;
                    padding-top: 0.3rem;

                    &:hover {
                        transform: rotate(23deg) scale(1.2);
                        cursor: pointer;
                    }
                }

                &:hover, &:active, &.active {
                    .nav-tooltip {
                        display: block;
                    }
                }

                .nav-tooltip {
                    position: absolute;
                    top: 50px;
                    left: 50%;
                    width: 140px;
                    transform: translateX(-60px);
                    line-height: 0;
                    display: none;

                    &::before {
                        content: "^";
                        display: block;
                        margin: 0 auto;
                        width: 0;
                        height: 0;
                        font-size: 0;
                        line-height: 0;
                        border: solid 10px transparent;
                        border-bottom-color: rgba(11, 90, 102, 0.5);
                        background-color: transparent;
                        position: absolute;
                        top: -20px;
                        left: 50%;
                        transform: translateX(-10px);
                    }

                    .nav-tooltip-content {
                        width: 100%;
                        background-color: rgba(11, 90, 102, 0.7);
                        backdrop-filter: blur(5px);
                        font-family: 'Piazzolla', serif;
                        box-shadow: 0 10px 25px -10px black;
                        border-radius: 0.5rem;
                        padding: 8px;
                        box-sizing: border-box;
                        color: white;

                        .key-value-pair {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-around;
                            align-items: center;

                            p.content {
                                font-weight: bold;
                                letter-spacing: 0.5px;
                                font-size: 0.8rem;
                                line-height: 32px;
                                margin: 0;
                                flex: 1;
                                transform: translateY(-3px);

                                .small {
                                    font-size: 0.66rem;
                                    line-height: calc(2rem - 16px);
                                }
                            }

                            .icon {
                                width: 30px;
                                height: 30px;
                                display: block;
                                transform: translateY(-4px);
                                padding: 0 4px 0 0;
                            }
                        }

                        .text {
                            font-size: 0.7rem;
                            line-height: 1.2;
                            width: 100%;
                            white-space: normal;
                            text-align: left;
                            letter-spacing: 0;
                            font-weight: bold;
                            /*font-style: italic;*/
                            color: rgba(255, 255, 255, 0.66);
                        }
                    }
                }
            }
        }

    }
</style>
