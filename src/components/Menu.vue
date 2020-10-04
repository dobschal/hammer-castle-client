<template>
    <div class="menu-wrapper" @click="$emit('CLOSE-MENU')">
        <div class="menu-container">
            <div class="menu-content" @click.stop>
                <div class="close" @click="close"> {{ closeButtonText }}</div>
                <div class="content">
                    <div class="items" v-if="type === 'menu'">
                        <div class="item" @click="type = 'ranking'">Ranking</div>
                        <div class="item" @click="type = 'history'">Show History</div>
                        <div class="item" @click="type = 'profile'">Profile</div>
                        <div class="item" @click="$emit('OPEN_PAGE', 'info')">Info</div>
                        <div class="item" @click="$emit('OPEN_PAGE', 'forum')">Forum</div>
                        <div class="item" @click="$emit('LOGOUT')">Logout</div>
                    </div>
                    <div v-else-if="type === 'ranking'" class="ranking items" @click.stop>
                        <!--                        <div class="item" @click="type = 'menu'">Back</div>-->
                        <div v-for="(rank, index) in ranking"
                             class="item"
                             :key="rank.username"
                             v-tooltip="'Jump to users home castle via click.'"
                             :class="{ highlight: rank.id === user.id }"
                             @click="showUser(rank.id)">
                            <span class="rank">{{ index + 1 }}.</span>
                            <span class="level">{{ rank.level }}</span>
                            <span class="username">{{ rank.username }}</span>
                        </div>
                    </div>
                    <div v-else-if="type === 'history'" class="items history">
                        <div v-for="item in actionLog" :key="item.id" class="item">
                            <DateView :timestamp="item.timestamp"></DateView>
                            <span class="text">{{ item.content }}</span>
                        </div>
                    </div>
                    <div v-else-if="type === 'profile'" class="items user">
                        <div class="item">
                            Username: {{ user.username }}
                        </div>
                        <div class="item">
                            Level: {{ user.level }}
                        </div>
                    </div>
                </div>
                <div class="footer">{{ version }} | {{ clientCommitHash }}</div>
            </div>
        </div>
    </div>
</template>

<script>

    import {version} from "../../package";
    import DateView from "./DateView";

    export default {
        name: "Menu",
        components: {
            DateView
        },
        data() {
            return {
                clientCommitHash: "",
                version,
                type: "menu"
            }
        },
        computed: {
            ranking() {
                return this.$store.state.ranking;
            },
            user() {
                return this.$store.state.user;
            },
            closeButtonText() {
                return this.type === "menu" ? "Close" : "Back";
            },
            actionLog() {
                return [...this.$store.state.actionLog].sort((a, b) => b.timestamp - a.timestamp);
            }
        },
        watch: {
            type(val) {
                if (val === "ranking") {
                    this.$store.dispatch("GET_RANKING");
                }
            }
        },
        mounted() {
            fetch("/commit-hash.txt").then(r => r.text()).then(r => {
                this.clientCommitHash = r;
            });
        },
        methods: {
            async showUser(userId) {
                const position = await this.$store.dispatch("GET_HOME_POSITION", userId);
                this.$emit("GO_TO", position);
                this.$emit("CLOSE-MENU");
            },
            close() {
                if (this.type === "menu") {
                    this.$emit('CLOSE-MENU');
                } else {
                    this.type = 'menu';
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .menu-wrapper {
        position: fixed;
        width: 100vw;
        height: 100vh;
        z-index: 5;
        background-color: rgba(0, 0, 0, 0.66);
        backdrop-filter: blur(5px);

        .menu-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100vw;
            height: 100vh;

            .menu-content {
                background-image: url("../assets/papyrus.svg");
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-position: 50% 50%;
                width: 302px;
                height: 394px;
                margin: -4rem auto 0 auto;

                .close {
                    background-image: url("../assets/icon-cancel.svg");
                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: right center;
                    background-color: rgba(0, 0, 0, 0.4);
                    height: 32px;
                    width: 32px;
                    font-size: 0;
                    line-height: 0;
                    border-radius: 50%;
                    margin-top: -24px;
                    margin-right: 1.4rem;
                    float: right;
                    transition: transform 0.5s ease-out;

                    &:hover, &:active {
                        cursor: pointer;
                        transform: scale(1.3);
                    }
                }

                .content {
                    height: 298px;
                    margin-bottom: 20px;
                    margin-top: 2rem;
                    overflow-y: auto;
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none;
                    -webkit-overflow-scrolling: touch;

                    &::-webkit-scrollbar {
                        display: none;
                    }

                    .items {
                        padding: 0rem 3rem 2rem 3rem;
                        text-align: center;

                        &.ranking, &.user {
                            .item {
                                padding: 0.5rem 0;
                                font-size: 0.9rem;
                            }
                        }

                        &.history {
                            .item {
                                padding: 0.5rem 0.3rem;
                                font-size: 0.9rem;

                                .date-view {
                                    font-size: 0.7rem;
                                    text-align: left;
                                }

                                .text {
                                    white-space: normal;
                                    text-align: left;
                                    display: block;
                                    font-family: 'Piazzolla', serif;
                                    font-size: 1rem;
                                    line-height: 1.2rem;
                                    letter-spacing: 0.3px;
                                }

                            }
                        }

                        .item {
                            font-size: 1.2rem;
                            padding: 0.77rem 1rem;
                            border-bottom: dashed 2px rgba(0, 0, 0, 0.15);
                            white-space: nowrap;
                            transition: transform 0.3s ease-out;

                            &:last-child {
                                border-bottom: none;
                            }

                            &:hover {
                                color: red;
                                cursor: pointer;
                                transform: rotate(1deg) scale(1.05);
                            }

                            &.highlight {
                                color: red;
                                font-weight: bold;
                                text-transform: uppercase;
                                background: rgba(255, 255, 255, 0.3);
                            }

                            .rank {
                                display: inline-block;
                                width: 40px;
                                opacity: 0.8;
                                letter-spacing: 0;
                            }

                            .level {
                                display: inline-block;
                                width: 50px;
                                font-weight: bold;
                                letter-spacing: 0;
                            }

                            .username {
                                display: inline-block;
                                width: 120px;
                                letter-spacing: 0;
                            }
                        }
                    }
                }

                // end .items

                .footer {
                    text-align: center;
                    font-weight: bold;
                    font-size: 66%;
                    color: rgba(0, 0, 0, 0.66);
                }
            }
        }

        // end .menu-container
    }
</style>
