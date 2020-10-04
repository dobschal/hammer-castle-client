<template>
    <div class="page-overlay" @click="$emit('CLOSE')">
        <div class="content" @click.stop>
            <div class="close" @click="$emit('CLOSE')">Close</div>
            <div class="title">{{title}}</div>
            <div style="clear: right"></div>
            <div class="content-inner">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PageOverlay",
        props: {
            title: String
        }
    }
</script>

<style lang="scss" scoped>
    .page-overlay {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 8;
        background-color: rgba(0, 0, 0, 0.5);
        width: 100vw;
        height: 100vh;
        padding: 2rem;
        box-sizing: border-box;

        .content {
            background-color: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(5px);
            border-radius: 0.5rem;
            box-shadow: 0 1rem 2rem -1rem black;
            min-height: 300px;
            padding: 1rem;
            font-family: 'Piazzolla', serif;
            letter-spacing: 0.1px;
            line-height: 1.2rem;
            font-size: 1rem;
            max-width: 640px;
            margin: 0 auto;


            .close {
                background-image: url("../assets/icon-cancel.svg");
                background-repeat: no-repeat;
                background-size: contain;
                background-position: right center;
                background-color: rgba(0, 0, 0, 0.4);
                height: 24px;
                width: 24px;
                font-size: 0;
                line-height: 0;
                border-radius: 50%;
                margin: 0 0 1rem 1rem;
                float: right;
                transition: transform 0.5s ease-out;

                &:hover, &:active {
                    cursor: pointer;
                    transform: scale(1.3);
                }
            }

            .title {
                font-size: 1.2rem;
                letter-spacing: 1px;
                font-weight: bold;
                line-height: 1.6rem;
            }

            .content-inner {
                max-height: calc(100vh - 9rem);
                -webkit-overflow-scrolling: touch;
                overflow-y: auto;
                -ms-overflow-style: none; /* IE and Edge */
                scrollbar-width: none;
            }
        }
    }
</style>
