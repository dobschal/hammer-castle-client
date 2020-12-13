<template>
    <div class="overlay-wrapper" @click="$emit('CLOSE-OVERLAY')">
        <div class="overlay-container">
            <div class="overlay-content" @click.stop @scroll.stop :class="type">
                <div class="close" @click="close">Close</div>
                <div class="content offline-history" v-if="type === 'OFFLINE_HISTORY'">
                    <h3>Good to see you!<br><small>That happened since your last visit...</small></h3>
                    <div class="item"
                         v-for="action in actions"
                         :key="action.id"
                         @click="showOnMap(action)">
                        <span class="message" :class="action.type">{{ action.content }}</span>
                    </div>
                </div>
                <div class="content quests" v-else-if="type === 'QUESTS'">
                    <h3>~ {{ $t("quest.overlay.title") }} ~</h3>
                    <div v-for="quest in quests"
                         :key="quest.id"
                         class="quest"
                         :class="{ 'can-be-claimed': quest.status === 'SOLVED_NEW' }">
                        <span>{{ $t(quest.titleKey) }}</span>
                        <button v-if="quest.status === 'SOLVED_NEW'" @click="claimReward(quest)">{{
                            $t("quest.overlay.claimReward") }}
                        </button>
                        <button v-else @click="openQuestInfo(quest)">> {{
                            $t("quest.overlay.show") }}
                        </button>
                    </div>
                </div>
                <div class="content quest" v-else-if="type === 'QUEST'">
                    <h3>~ Quest Info ~</h3>
                    <div class="content-inner">
                        <p v-if="selectedQuest">{{ $t(selectedQuest.titleKey)
                            }}</p>
                        <img v-if="selectedQuest"
                             :src="'questImages/' + selectedQuest.imageName + '.png'"
                             alt="Quest Image">
                        <p v-if="selectedQuest">{{ $t(selectedQuest.messageKey)
                            }}</p>
                        <button @click="close">{{ $t("general.andGo") }}
                        </button>
                    </div>
                </div>
            </div>
            <span class="info-footer" v-if="type === 'OFFLINE_HISTORY'">Click on an item to see where it happened.</span>
            <span class="info-footer" v-if="type === 'QUESTS'">{{ $t("quest.overlay.info") }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "InfoOverlay",
        props: {
            type: {
                type: String,
                validator(val) {
                    return ["OFFLINE_HISTORY", "QUESTS", "QUEST"].includes(val);
                }
            }
        },
        data() {
            return {
                selectedQuest: undefined
            };
        },
        computed: {

            /**
             * @return {Quest[]}
             */
            quests() {
                return this.$store.state.quests.filter(quest => quest.status !== "SOLVED_SEEN");
            },

            /**
             * @return {ActionLog[]}
             */
            actions() {
                return [...this.$store.state.actionsSinceLastVisit].sort((a, b) => b.timestamp - a.timestamp);
            }
        },
        watch: {
            type(val) {
                if (val === "QUEST") {
                    if (!this.selectedQuest) this.$emit('update:type', "QUESTS");
                    if (this.selectedQuest.status === "OPEN_NEW") {
                        this.$store.dispatch("READ_NEW_QUEST", this.selectedQuest);
                    }
                }
            }
        },
        methods: {

            /**
             * @param {Quest} quest
             */
            openQuestInfo(quest) {
                this.selectedQuest = quest;
                this.$emit('update:type', 'QUEST');
            },

            close() {
                this.$emit('CLOSE-OVERLAY');
            },

            /**
             * @param {ActionLog} action
             */
            showOnMap(action) {
                this.$emit('SHOW-ON-MAP', action);
                this.$emit('CLOSE-OVERLAY');
            },

            /**
             * @param {Quest} quest
             */
            async claimReward(quest) {
                try {
                    await this.$store.dispatch("CLAIM_QUEST_REWARD", quest);
                    await this.$store.dispatch("GET_QUESTS");
                    this.$emit('CLOSE-OVERLAY');
                } catch (e) {
                    this.$emit("ERROR", e.response.data.message);
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

    @keyframes drive_in {
        0% {
            transform: translateX(-25vw);
            opacity: 0;
        }
        50% {
            opacity: 0.5;
        }
        100% {
            transform: translateX(4px);
            opacity: 1;
        }
    }

    .overlay-wrapper {
        position: fixed;
        width: 100vw;
        height: 100vh;
        z-index: 5;
        background-color: rgba(0, 0, 0, 0.66);
        backdrop-filter: blur(5px);

        .overlay-container {
            display: flex;
            flex-direction: column;
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
                margin: -1rem auto 0 auto;

                &.QUEST {
                    .content {
                        padding: 0 3rem;
                        font-family: 'Piazzolla', serif;
                        letter-spacing: 0.3px;
                        font-weight: 600;
                        overflow: hidden;
                        height: 355px;

                        h3 {
                            text-align: center;
                        }

                        .content-inner {
                            overflow-y: auto;
                            overflow-x: hidden;
                            -ms-overflow-style: none; /* IE and Edge */
                            scrollbar-width: none;
                            -webkit-overflow-scrolling: touch;
                            height: 300px;

                            p {
                                margin: 0 0 1rem 0;
                                font-size: 15px;
                                line-height: 21px;
                                color: rgba(0, 0, 0, 0.7);

                                &:last-child {
                                    padding-bottom: 3rem;
                                }
                            }

                            img {
                                width: 100%;
                                border-radius: 0.5rem;
                                overflow: hidden;
                                box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.19), 0 0 1px 1px rgba(0, 0, 0, 0.3);
                                margin: 0 0 1rem 0;
                            }

                            button {
                                margin: 0 0 2rem 0;
                                width: 100%;
                            }
                        }
                    }
                }

                &.QUESTS {
                    background-image: url("../../assets/open-scroll.svg");
                    width: 320px;
                    height: 400px;

                    .content {
                        height: 240px;
                        margin: 3.35rem 3.6rem 0 3.46rem;
                        overflow-y: auto;
                        overflow-x: hidden;
                        -ms-overflow-style: none; /* IE and Edge */
                        scrollbar-width: none;
                        -webkit-overflow-scrolling: touch;
                        padding: 0.5rem 0.3rem;
                        box-sizing: border-box;
                        font-family: 'Piazzolla', serif;

                        h3 {
                            color: #BC631C;
                            text-align: center;
                            margin: 0 0 1rem 0;
                            font-weight: bold;
                        }

                        div.quest {
                            background-image: url("../../assets/icon-tied-scroll-brown.svg");
                            background-repeat: no-repeat;
                            background-size: 26px;
                            padding: 0 0 0 34px;
                            font-size: 0.9rem;
                            margin-top: 0.5rem;
                            letter-spacing: 0.5px;
                            min-height: 40px;

                            &.can-be-claimed {
                                background-image: url("../../assets/icon-scroll-unfurled.svg");

                                button {
                                    background-image: url("../../assets/button-bg-bright.svg");
                                }
                            }

                            button {
                                border: none;
                                background-color: transparent;
                                background-image: url("../../assets/button-bg-dark.svg");
                                background-repeat: no-repeat;
                                background-size: 100% 100%;
                                background-position: center;
                                white-space: nowrap;
                                backdrop-filter: none;
                                font-size: 0.8rem;
                                float: right;
                                height: 30px;
                                width: 124px;
                                padding: 0;
                                margin: 1rem -0.5rem 0 0;
                                letter-spacing: 0.3px;
                            }
                        }
                    }
                }

                &.OFFLINE_HISTORY {
                    .content {
                        height: 330px;
                        margin: 1rem 3rem;
                        overflow-y: auto;
                        overflow-x: hidden;
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
                                font-family: 'Piazzolla', serif;
                                font-size: 1rem;
                                line-height: 1.2rem;
                                letter-spacing: 1px;

                                &.OPPONENT_BUILD_CASTLE,
                                &.CASTLE_DESTROYED {
                                    background-image: url("../../assets/icon-castle-negative.svg");
                                }

                                &.BUILD_CASTLE {
                                    background-image: url("../../assets/icon-castle-positive.svg");
                                }

                                &.CATAPULT_FAILED, &.OPPONENT_BUILD_CATAPULT {
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

                                &.OPPONENT_BUILD_WAREHOUSE, &.OPPONENT_UPGRADED_WAREHOUSE, &.WAREHOUSE_DESTROYED {
                                    background-image: url("../../assets/icon-warehouse-negative.svg");
                                }

                                &.BUILD_WAREHOUSE, &.UPGRADE_WAREHOUSE, &.OPPONENT_LOST_WAREHOUSE {
                                    background-image: url("../../assets/icon-warehouse-positive.svg");
                                }


                            }
                        }

                        &::-webkit-scrollbar {
                            display: none;
                        }
                    }
                }

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
            }

            .info-footer {
                display: block;
                min-height: 21px;
                line-height: 21px;
                font-size: 14px;
                color: white;
                letter-spacing: 0.66px;
                font-family: 'Piazzolla', serif;
                font-style: italic;
                opacity: 0.9;
                background-image: url("../../assets/icon-info.svg");
                background-repeat: no-repeat;
                background-size: 21px;
                background-position: 0 6px;
                padding: 4px 0 4px 28px;
                box-sizing: border-box;
                width: 80vw;
                max-width: 280px;
                transform: translateX(4px);
                animation: drive_in;
                animation-iteration-count: 1;
                animation-duration: 0.5s;
                animation-timing-function: ease-out;
            }

        }

        // end .overlay-container
    }
</style>
