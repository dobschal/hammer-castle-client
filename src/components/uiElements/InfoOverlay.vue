<template>
    <div class="overlay-wrapper" @click="$emit('CLOSE-OVERLAY')">
        <div class="overlay-container">
            <div class="overlay-content" @click.stop @scroll.stop>
                <div class="close" @click="close">Close</div>
                <div class="content">
                    <h3>Good to see you!<br><small>That happened since your last visit...</small></h3>
                    <div class="item"
                         v-for="action in actions"
                         :key="action.id"
                         @click="showOnMap(action)">
                        <span class="message" :class="action.type">{{ action.content }}</span>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "InfoOverlay",
        computed: {

            /**
             * @return {ActionLog[]}
             */
            actions() {
                return [...this.$store.state.actionsSinceLastVisit].sort((a, b) => b.timestamp - a.timestamp);
            }
        },
        methods: {
            close() {
                this.$emit('CLOSE-OVERLAY');
            },

            /**
             * @param {ActionLog} action
             */
            showOnMap(action) {
                this.$emit('SHOW-ON-MAP', action);
                this.$emit('CLOSE-OVERLAY');
            }
        }
    };
</script>

<style lang="scss" scoped>
    .overlay-wrapper {
        position: fixed;
        width: 100vw;
        height: 100vh;
        z-index: 5;
        background-color: rgba(0, 0, 0, 0.66);
        backdrop-filter: blur(5px);

        .overlay-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100vw;
            height: 100vh;

            .overlay-content {
                background-image: url("../../assets/info-overlay-bg.png");
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-position: 50% 50%;
                width: 302px;
                height: 394px;
                margin: -4rem auto 0 auto;

                .close {
                    background-image: url("../../assets/icon-cancel.svg");
                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: right center;
                    background-color: rgba(0, 0, 0, 0.4);
                    height: 32px;
                    width: 32px;
                    font-size: 0;
                    line-height: 0;
                    border-radius: 50%;
                    margin-top: -32px;
                    margin-right: 1.4rem;
                    float: right;
                    /*transition: transform 0.5s ease-out;*/

                    &:hover, &:active {
                        cursor: pointer;
                        transform: scale(1.3);
                    }
                }

                .content {
                    height: 330px;
                    margin: 1rem 3rem;
                    overflow-y: auto;
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none;
                    -webkit-overflow-scrolling: touch;

                    h3 {
                        letter-spacing: 2px;
                        font-family: 'Piazzolla', serif;
                        line-height: 1;
                        margin: 0.5rem 0 1.5rem 0;

                        small {
                            /*font-style: italic;*/
                            padding-top: 0.5rem;
                            display: block;
                            font-weight: normal;
                            letter-spacing: 1px;
                        }
                    }

                    .item {
                        margin-bottom: 0.66rem;
                        background-image: url("../../assets/icon-chevron-right.svg");
                        background-position: center right;
                        background-repeat: no-repeat;
                        background-size: 16px;
                        padding-bottom: 0.66rem;
                        border-bottom: dashed 2px rgba(0, 0, 0, 0.3);

                        .message {
                            display: block;
                            padding-left: 40px;
                            padding-right: 24px;
                            background-position: center left;
                            background-repeat: no-repeat;
                            background-size: 32px;

                            &.OPPONENT_BUILD_CASTLE,
                            &.CASTLE_DESTROYED {
                                background-image: url("../../assets/icon-castle-negative.svg");
                            }

                            &.BUILD_CASTLE {
                                background-image: url("../../assets/icon-castle-positive.svg");
                            }

                            &.CATAPULT_FAILED {
                                background-image: url("../../assets/icon-catapult-negative.svg");
                            }

                            &.CATAPULT_SUCCESS, &.BUILD_CATAPULT {
                                background-image: url("../../assets/icon-catapult-positive.svg");
                            }

                            &.LOST_KNIGHT, &.OPPONENT_BUILD_KNIGHT, &.OPPONENT_MOVES_KNIGHT {
                                background-image: url("../../assets/icon-knight-negative.svg");
                            }

                            &.OPPONENT_LOST_KNIGHT, &.BUILD_KNIGHT {
                                background-image: url("../../assets/icon-knight-positive.svg");
                            }

                            &.OPPONENT_BUILD_WAREHOUSE, &.OPPONENT_UPGRADED_WAREHOUSE {
                                background-image: url("../../assets/icon-warehouse-negative.svg");
                            }

                            &.BUILD_WAREHOUSE, &.UPGRADE_WAREHOUSE {
                                background-image: url("../../assets/icon-warehouse-positive.svg");
                            }


                        }
                    }

                    &::-webkit-scrollbar {
                        display: none;
                    }
                }
            }
        }

        // end .overlay-container
    }
</style>
