<template>
    <div class="container">
        <div v-for="item in actionLog" :key="item.id" class="item">
            <DateView :timestamp="item.timestamp"></DateView>
            <span class="content">{{ item.content }}</span>
        </div>
    </div>
</template>

<script>
    import DateView from "./DateView";

    export default {
        name: "ActionLog",
        components: {
            DateView
        },
        computed: {
            actionLog() {
                return this.$store.state.actionLog;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .container {
        position: fixed;
        right: 0;
        bottom: 0;
        z-index: 8;
        padding: 1rem;
        color: white;

        .item {
            background-color: rgba(0, 0, 0, 0.3);
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
