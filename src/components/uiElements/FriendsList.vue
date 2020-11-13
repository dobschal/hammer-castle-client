<template>
    <div class="friends-list" :class="{ open: open }">
        <div class="toggle" @click="$emit('update:open', !open)"></div>
        <div class="list" v-if="open">
            <div v-for="friend in friends"
                 :key="friend.id"
                 class="friend"
                 @click="$emit('OPEN_PLAYERS_LIST')">
                <span>{{ friend.level }}</span><span>{{ friend.username }}</span>
            </div>
            <div class="add-friend" @click="$emit('ADD_FRIEND')">+ Add Friend
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FriendsList",
        computed: {

            /**
             * @return {Friend[]}
             */
            friends() {
                return this.$store.state.friends;
            }
        },
        props: {
            open: Boolean
        },
        created() {
            this.$store.dispatch("GET_FRIENDS");
        }
    };
</script>

<style lang="scss" scoped>
    .friends-list {
        position: fixed;
        top: 16.5rem;
        right: 0.9rem;
        z-index: 3;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0;
        border-radius: 1rem 0 0 1rem;
        will-change: transform;
        transition: transform 0.3s ease-in-out;
        transform: translateX(min(calc(320px - 32px - 1rem), calc(80vw - 32px - 1rem)));
        color: white;
        font-weight: bold;
        width: 80vw;
        max-width: 320px;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;

        &.open {
            transform: translateX(0);
            background-color: rgba(11, 90, 102, 0.5);
            backdrop-filter: blur(5px);
            padding: 0.5rem;
            box-shadow: 0 25px 25px -25px black;
            right: 0;

            .toggle {
                background-color: rgba(11, 90, 102, 0);
                backdrop-filter: none;
            }
        }

        .toggle {
            background-color: rgba(11, 90, 102, 0.5);
            backdrop-filter: blur(5px);
            background-image: url("../../assets/icon-friends.svg");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 32px;
            margin: auto 0;
            border-radius: 1rem;
            flex: 0 0 calc(32px + 0.9rem);
            width: calc(32px + 0.9rem);
            height: 54px;
            box-sizing: border-box;
            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
            -khtml-user-select: none; /* Konqueror HTML */
            -moz-user-select: none; /* Old versions of Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none;
        }

        .list {
            display: flex;
            flex-direction: column;

            b {
                display: block;
                margin: 0.2rem 0 1rem 0.5rem;
                font-size: 1.05rem;
                letter-spacing: 1px;
                border-bottom: dashed 2px rgba(255, 255, 255, 0.6);
                width: 100%;
            }

            .friend {
                white-space: nowrap;
                span:first-child {
                    font-family: 'Piazzolla', serif;
                    width: 50px;
                    display: inline-block;
                    text-align: right;
                }
                span:nth-child(2) {
                    padding-left: 10px;
                }
            }

            .add-friend {
                background-color: rgba(8, 49, 57, 0.15);
                backdrop-filter: blur(5px);
                padding: 8px;
                border-radius: 8px;
                margin: 1rem 0 0.2rem 0.5rem;
                box-sizing: border-box;
            }
        }

    }
</style>
