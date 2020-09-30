<template>
    <div class="container">
        <span class="close-button" :class="{ open: open }" @click="toggle">{{ open ? "Close" : "Open Logs" }}</span>
        <template v-if="open">
            <div v-for="(item, index) in actionLog" :key="item.id" class="item"
                 :style="{ opacity: Math.min(1, 0.5 + index / actionLog.length) }">
                <DateView :timestamp="item.timestamp"></DateView>
                <span class="content">{{ item.content }}</span>
            </div>
        </template>
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

        @media only screen and (max-width: 1024px) {
            display: none;
        }

        .close-button {
            display: block;
            text-align: center;
            background-color: #0b5a66;
            border-radius: 5px;
            width: 120px;
            margin-left: calc(100% - 120px);
            margin-bottom: 1rem;
            padding: 0.3rem;

            &.open {
                background-color: #ff6d69;

                &:hover {
                    background-color: #893635;
                    cursor: pointer;
                }
            }

            &:hover {
                background-color: #083139;
                cursor: pointer;
            }
        }

        .item {
            background: rgba(5, 29, 32, 0.66);
            backdrop-filter: blur(15px);
            margin-bottom: 1rem;
            padding: 0.5rem;
            border-radius: 3px;

            .date-view {
                font-size: 0.6rem;
            }

            .content {
                font-size: 0.8rem;
            }
        }
    }
</style>
