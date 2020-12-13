<template>
    <div class="short-message-container" v-if="messages.length > 0">
        <div class="message" v-for="message in messages" :key="message.id"
             @click="onMessageClick(message)">
            {{ message.message }}
        </div>
    </div>
</template>

<script>
    export default {
        name: "ShortMessageView",
        computed: {

            /**
             * @return {ShortMessage[]}
             */
            messages() {
                return this.$store.state.shortMessages;
            }
        },
        watch: {
            messages: {
                deep: true,

                /**
                 * @param {ShortMessage[]} messages
                 */
                handler(messages) {
                    console.log("[ShortMessageView] Messages changed: ", messages);
                }
            }
        },
        methods: {

            /**
             * @param {ShortMessage} message
             */
            onMessageClick(message) {
                this.$emit("show-on-map", message);
            }
        }
    };
</script>

<style lang="scss" scoped>

    @keyframes drive_in {
        0% {
            transform: translateY(-5rem);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .short-message-container {
        position: fixed;
        top: 3rem;
        margin-top: env(safe-area-inset-top, 0);
        left: 4rem;
        width: calc(100vw - 8rem);
        height: 100px;
        z-index: 1;

        .message {
            animation: drive_in;
            animation-timing-function: cubic-bezier(.53,1.43,.65,.96);
            animation-iteration-count: 1;
            animation-duration: 0.5s;
            background: rgba(248, 219, 186, 0.85);
            backdrop-filter: blur(5px);
            padding: 0.5rem;
            text-align: center;
            border-radius: 0.5rem;
            box-shadow: 0 10px 10px -5px rgba(0, 0, 0, 0.42);
            max-width: 340px;
            margin: 0.15rem auto;

            &:hover {
                cursor: pointer;
            }
        }
    }
</style>
