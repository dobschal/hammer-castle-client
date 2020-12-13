<template>
    <div class="page-overlay" @click="$emit('CLOSE')">
        <div class="content" @click.stop>
            <div class="close" @click="$emit('CLOSE')">Close</div>
            <div class="title">~ {{title}} ~</div>
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
        background-color: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(10px);
        width: 100vw;
        height: 100vh;
        padding: 2rem;
        box-sizing: border-box;

        .content {
            background-color: #f7f7f7;
            border-radius: 0.28rem;
            box-shadow: 0 1rem 1rem -1rem rgba(0,0,0,0.3), 0 0 5rem rgba(0,0,0,0.2), 0 0 2px rgba(0,0,0,0.15);
            min-height: 300px;
            padding: 1rem 1rem 0 1rem;
            font-family: 'Piazzolla', serif;
            letter-spacing: 0.1px;
            line-height: 1.2rem;
            font-size: 1rem;
            max-width: 920px;
            margin: 0 auto;
            overflow-y: hidden;


            .close {
                background-image: url("../assets/icon-cancel.svg");
                background-repeat: no-repeat;
                background-size: contain;
                background-position: right center;
                background-color: rgba(0, 0, 0, 0.8);
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
                text-align: center;
            }

            .content-inner {
                max-height: calc(100vh - 8rem);
                overflow-y: auto;
                width: calc(100% + 1rem);
                overflow-x: hidden;
                box-sizing: border-box;
                margin: 0 -1rem 0 0;
                padding-right: 1rem;
            }
        }
    }
</style>
