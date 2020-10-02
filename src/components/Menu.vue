<template>
    <div class="menu-wrapper" @click="$emit('CLOSE-MENU')">
        <div class="menu-container">
            <div class="menu-content" @click.stop>
                <div class="content">
                    <div class="items" v-if="type === 'menu'">
                        <div class="item">Help & Info</div>
                        <div class="item" @click="type = 'ranking'">Ranking</div>
                        <div class="item">Profile</div>
                        <div class="item">Forum</div>
                        <div class="item" @click="$emit('LOGOUT')">Logout</div>
                        <div class="item" @click="$emit('CLOSE-MENU')">Close Menu</div>
                    </div>
                    <div v-else-if="type === 'ranking'" class="ranking items" @click.stop>
                        <div class="item" @click="type = 'menu'">Back</div>
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
                </div>
                <div class="footer">{{ version }} | {{ clientCommitHash }}</div>
            </div>
        </div>
    </div>
</template>

<script>

    import {version} from "../../package";

    export default {
        name: "Menu",
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
            }
        }
    };
</script>

<style lang="scss" scoped>
    .menu-wrapper {
        position: fixed;
        width: 100vw;
        height: 100vh;
        z-index: 2;
        background-color: rgba(0, 0, 0, 0.5);

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
                margin: auto;

                .content {
                    height: 298px;
                    margin-bottom: 20px;
                    margin-top: 2rem;
                    overflow-y: auto;
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none;

                    &::-webkit-scrollbar {
                        display: none;
                    }

                    .items {
                        padding: 0rem 3rem 2rem 3rem;
                        text-align: center;

                        &.ranking {
                            .item {
                                padding: 0.5rem 0;
                            }
                        }

                        .item {
                            font-size: 1.2rem;
                            padding: 0.77rem 1rem;
                            border-bottom: dashed 2px rgba(0, 0, 0, 0.19);
                            white-space: nowrap;

                            &:last-child {
                                border-bottom: none;
                            }

                            &:hover {
                                color: red;
                                cursor: pointer;
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
