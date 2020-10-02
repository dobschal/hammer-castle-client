<template>
    <div class="container">
        <template v-if="open">
            <div v-for="(item, index) in actionLog" :key="item.id" class="item"
                 :style="{ opacity: Math.min(1, 0.5 + index / actionLog.length) }">
                <DateView :timestamp="item.timestamp"></DateView>
                <span class="content">{{ item.content }}</span>
            </div>
        </template>
        <span class="close-button" :class="{ open: open }" @click="toggle">{{ open ? "Close" : "Open Logs" }}</span>
    </div>
</template>

<script>
    import DateView from "./DateView";

    export default {
        name: "ActionLog",
        components: {
            DateView
        },
        data() {
            return {
                open: window.innerWidth > 1024
            };
        },
        computed: {
            actionLog() {
                return this.$store.state.actionLog.slice(this.$store.state.actionLog.length - 5, this.$store.state.actionLog.length);
            }
        },
        methods: {
            toggle() {
                this.open = !this.open;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .container {
        position: fixed;
        right: 0;
        bottom: 0;
        z-index: 10;
        padding: 1rem 2rem;
        color: white;
        max-width: 40vw;

        @media only screen and (max-width: 1024px) {
            display: none;
        }

        .close-button {
            display: block;
            text-align: center;
            background: rgba(11, 90, 102, 0.7);
            backdrop-filter: blur(5px);
            border-radius: 5px;
            width: 120px;
            margin-left: calc(100% - 120px);
            margin-bottom: 1rem;
            padding: 0.3rem;
            box-shadow: 0 5px 15px -5px black;
            transition: transform 0.3s ease-out;
            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
            -khtml-user-select: none; /* Konqueror HTML */
            -moz-user-select: none; /* Old versions of Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none;

            &.open {
                background: rgba(236, 0, 0, 0.7);

                &:hover {
                    background: rgba(200, 0, 0, 0.8);
                    cursor: pointer;
                }
            }

            &:hover {
                background: rgba(11, 75, 87, 0.8);
                cursor: pointer;
                transform: scale(1.05);
            }
        }

        .item {
            background: rgba(5, 45, 51, 1.0);
            backdrop-filter: blur(5px);
            margin-bottom: 1rem;
            padding: 0.5rem;
            border-radius: 3px;
            font-family: 'Piazzolla', serif;
            letter-spacing: 0.8px;

            .date-view {
                font-size: 0.6rem;
                line-height: 0.4rem;
            }

            .content {
                font-size: 0.8rem;
                line-height: 0.8rem;
            }
        }
    }
</style>
