<template>
    <div class="wrapper">
        <div class="buttons">
            <div class="icon-value-pair">
                <span class="icon"><img src="../assets/icon-hammer.svg" alt="Hammer"></span>
                <span class="value">{{ hammer }}</span>
            </div>
            <div class="icon-value-pair">
                <span class="icon"><img src="../assets/icon-hammer-plus.svg" alt="Hammer Per Minute"></span>
                <span class="value">{{ hammerPerMinute }} <span class="small">/ min</span></span>
            </div>
            <div class="icon-value-pair">
                <span class="icon"><img src="../assets/icon-level.svg" alt="Level"></span>
                <span class="value">{{ level }}</span>
            </div>
            <div class="icon-value-pair" @click="openMenu">
                <span class="icon burger-button"><img src="../assets/icon-burger.svg" alt="Menu"></span>
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
            hammerPerMinute() {
                return this.$store.state.user ? this.$store.state.user.hammerPerMinute : 0;
            },
            level() {
                return this.$store.state.user ? this.$store.state.user.level : 0;
            },
            username() {
                return this.$store.state.user ? this.$store.state.user.username : "Unknown";
            }
        },
        methods: {
            openMenu() {
                this.$emit("OPEN-MENU");
            }
        }
    };
</script>

<style lang="scss" scoped>
    .wrapper {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
        width: 100vw;
        margin-left: 0;
        text-align: center;
        background: rgba(11, 90, 102, 0.7);
        backdrop-filter: blur(5px);

        .buttons {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            .icon-value-pair {
                padding: 0 1rem;
                border-radius: 8px;
                display: flex;
                flex-direction: row;
                align-items: center;
                white-space: nowrap;

                &:first-child {
                    .icon {
                        width: 32px;
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
                        font-size: 66%;
                    }
                }

                .burger-button {
                    transition: transform 0.3s ease-out;

                    &:hover {
                        transform: rotate(23deg) scale(1.2);
                        cursor: pointer;
                    }
                }
            }
        }

    }
</style>
