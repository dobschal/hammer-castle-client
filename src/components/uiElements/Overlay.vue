<template>
    <div class="overlay-wrapper" @click="$emit('CLOSE-OVERLAY')">
        <div class="overlay-container">
            <div class="overlay-content" @click.stop>
                <div class="back"
                     @click="back"
                     v-if="typeHistory.length > 1">
                    Back
                </div>
                <div class="close" @click="close">Close</div>
                <h3>~ {{ title }} ~</h3>
                <div class="content">
                    <div class="items" v-if="type === 'menu'">
                        <div class="item"
                             @click="$emit('update:type', 'ranking')">Players
                        </div>
                        <div class="item"
                             @click="$emit('update:type', 'history')">Show
                            History
                        </div>
                        <div class="item"
                             @click="showOwnProfile">Profile
                        </div>
                        <div class="item" @click="$emit('OPEN_PAGE', 'info')">
                            Info
                        </div>
                        <div class="item" @click="$emit('OPEN_PAGE', 'forum')">
                            Forum
                        </div>
                        <div class="item" @click="$emit('LOGOUT')">Logout</div>
                    </div>
                    <div v-else-if="type === 'ranking'" class="ranking items" @click.stop>
                        <div v-for="(rank, index) in ranking"
                             class="item"
                             :key="rank.username"
                             v-tooltip="'Jump to users home castle via click.'"
                             :class="{ highlight: rank.id === user.id }"
                             @click="showPlayersProfile(rank)">
                            <span class="rank">{{ index + 1 }}.</span>
                            <span class="level">{{ rank.level }}</span>
                            <span class="username">{{ rank.username }}</span>
                        </div>
                    </div>
                    <div v-else-if="type === 'history'" class="items history">
                        <div v-for="item in actionLog"
                             :key="item.id"
                             class="item"
                             @click="showActionLogOnMap(item)">
                            <span class="icon" :class="item.type"></span>
                            <DateView :timestamp="item.timestamp"></DateView>
                            <span class="text">
                                {{ item.content }}
                            </span>
                        </div>
                    </div>
                    <div v-else-if="type === 'profile'" class="items user">
                        <div class="item profile">
                            <span>Name:</span>{{ selectedPlayer.username }}<br>
                            <span>Level:</span>{{ selectedPlayer.level }}<br>
                            <span>Is Friend:</span>{{ isFriend ? "Yes" : "No" }}
                        </div>
                        <div class="item button"
                             @click="showUserOnMap(selectedPlayer.id)">
                            Show On Map
                        </div>
                        <div v-if="selectedPlayer.id !== user.id && !isFriend"
                             class="item button"
                             @click="addAsFriend(selectedPlayer.username)">
                            Add As Friend
                        </div>
                    </div>
                    <div v-else-if="type === 'add-friend'"
                         class="items add-friend" @click.stop>
                        <input type="text"
                               placeholder="Enter a username"
                               autofocus
                               @keyup="searchUser">
                        <div v-if="searchUserResult">
                            <div v-if="searchUserResult.length === 0">No Users
                                Found
                            </div>
                            <div v-else>
                                <div v-for="user in searchUserResult"
                                     :key="user.username"
                                     class="item"
                                     @click="showPlayersProfile(user)">
                                    {{ user.username }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer">v.{{ version }} ~ c.{{ clientCommitHash }} ~
                    s.{{serverCommitHash}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import {version} from "../../../package.json";
    import DateView from "../DateView.vue";

    export default {
        name: "Overlay",
        components: {
            DateView
        },
        props: {
            type: {
                type: String,
                default: "menu"
            }
        },
        data() {
            return {
                typeHistory: [],
                clientCommitHash: "",
                serverCommitHash: "",
                version,
                searchWaiterId: undefined,
                searchUserResult: undefined,
                selectedPlayer: undefined
            }
        },
        computed: {

            isFriend() {
                if (!this.selectedPlayer) return false;
                return this.$store.state.friends.some(friend => this.selectedPlayer.id === friend.id);
            },

            title() {
                switch (this.type) {
                    case "ranking":
                        return "Players";
                    case "menu":
                        return "Menu";
                    case "history":
                        return "History";
                    case "profile":
                        return "Profile";
                    case "add-friend":
                        return "Find Friends";
                    default:
                        return "";
                }
            },
            ranking() {
                return this.$store.state.ranking;
            },
            user() {
                return this.$store.state.user;
            },

            /**
             * @return {ActionLog[]}
             */
            actionLog() {
                const actionLog = [...this.$store.state.actionLog].sort((a, b) => b.timestamp - a.timestamp);
                console.log("[Overlay] Action log: ", actionLog);
                return actionLog;
            }
        },
        watch: {
            type(val) {
                this.typeHistory.push(val);
                if (val === "ranking") {
                    this.$store.dispatch("GET_RANKING");
                }
            }
        },
        created() {
            if (this.type === "profile" && !this.selectedPlayer) {
                this.$emit("update:type", "ranking");
            }
            this.typeHistory.push(this.type);
            if (this.type === "ranking") {
                this.$store.dispatch("GET_RANKING");
            }
        },
        mounted() {
            fetch("/commit-hash.txt").then(r => r.text()).then(r => {
                this.clientCommitHash = r;
            });
            fetch("/commit-hash-server.txt").then(r => r.text()).then(r => {
                this.serverCommitHash = r;
            });
        },
        beforeDestroy() {
            this.selectedPlayer = undefined;
        },
        methods: {

            back() {
                this.typeHistory.pop();
                const lastType = this.typeHistory[this.typeHistory.length - 1];
                this.typeHistory.pop();
                if (lastType) {
                    this.$emit("update:type", lastType);
                } else {
                    this.$emit("CLOSE-OVERLAY");
                }
            },

            /**
             * @typedef Player
             * @type object
             * @property {number} level
             * @property {string} username
             * @property {number} id
             *
             * @param {Player} player
             */
            showPlayersProfile(player) {
                this.selectedPlayer = player;
                this.$emit("update:type", "profile");
            },

            /**
             * @param {InputEvent} event
             */
            searchUser(event) {
                const query = event.target.value;
                if (query && query.length > 1) {
                    if (this.searchWaiterId) clearTimeout(this.searchWaiterId);
                    this.searchWaiterId = setTimeout(async () => {
                        const {users} = await this.$store.dispatch("FIND_USER", query);
                        this.searchUserResult = users;
                    }, 500);
                }
            },

            async showUserOnMap(userId) {
                const position = await this.$store.dispatch("GET_HOME_POSITION", userId);
                this.$emit("GO_TO", position);
                this.$emit("CLOSE-OVERLAY");
            },

            close() {
                this.$emit('CLOSE-OVERLAY');
            },

            showOwnProfile() {
                this.selectedPlayer = this.user;
                this.$emit('update:type', 'profile');
            },

            /**
             * @param {string} username
             */
            async addAsFriend(username) {
                await this.$store.dispatch("ADD_FRIEND", username);
                await this.$store.dispatch("GET_FRIENDS");
            },

            /**
             * @param {ActionLog} item
             */
            showActionLogOnMap(item) {
                console.log("[Overlay] Clicked action log item: ", item);
                if (item.x !== -1 && item.y !== -1) {
                    this.$emit("SHOW-ACTION-On-MAP", item);
                    this.$emit("CLOSE-OVERLAY");
                } else {
                    this.$emit("ERROR", "Sorry! This history entry does not contain a position.");
                }
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
                background-image: url("../../assets/papyrus.svg");
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
                    margin-top: -24px;
                    margin-right: 1.4rem;
                    float: right;
                    /*transition: transform 0.5s ease-out;*/

                    &:hover, &:active {
                        cursor: pointer;
                        transform: scale(1.3);
                    }
                }

                .back {
                    background-image: url("../../assets/icon-back.svg");
                    background-repeat: no-repeat;
                    background-size: 26px 26px;
                    background-position: center center;
                    background-color: rgba(0, 0, 0, 0.4);
                    height: 32px;
                    width: 32px;
                    font-size: 0;
                    line-height: 0;
                    border-radius: 50%;
                    margin-top: -24px;
                    margin-left: 1rem;
                    float: left;

                    &:hover, &:active {
                        cursor: pointer;
                        transform: scale(1.3);
                    }
                }

                h3 {
                    margin: 1rem 0 0 0;
                    padding-top: 1.2rem;
                    text-align: center;
                    font-size: 1.1rem;
                    font-weight: 900;
                }

                .content {
                    height: 270px;
                    margin-bottom: 20px;
                    margin-top: 0.3rem;
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
                                background-image: url("../../assets/icon-chevron-right.svg");
                                background-position: center right;
                                background-repeat: no-repeat;
                                text-align: left;
                                background-size: 16px;

                                .date-view {
                                    font-family: 'Piazzolla', serif;
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

                                .icon {
                                    background-position: top left;
                                    background-repeat: no-repeat;
                                    background-size: 24px;
                                    display: block;
                                    height: 24px;
                                    width: 24px;
                                    float: right;
                                    margin-right: 0.5rem;

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
                        }

                        &.add-friend {

                            input {
                                background: rgba(255, 255, 255, 0.66);
                                padding: 0.4rem 0.6rem;
                                border: solid 1px rgba(0, 0, 0, 0.3);
                                border-radius: 0.5rem;
                                margin: 0.5rem 0 0 0;
                            }
                        }

                        .item {
                            font-size: 1.2rem;
                            padding: 0.77rem 1rem;
                            border-bottom: dashed 2px rgba(0, 0, 0, 0.15);
                            white-space: nowrap;
                            /*transition: transform 0.3s ease-out;*/

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

                            &.button {
                                font-weight: bold;
                            }

                            &.profile {
                                text-align: left;
                                padding-left: 1rem;

                                span {
                                    display: inline-block;
                                    width: 50%;
                                    text-align: right;
                                    padding-right: 1rem;
                                    box-sizing: border-box;
                                }
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

        // end .overlay-container
    }
</style>
