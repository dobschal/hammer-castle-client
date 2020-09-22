<template>
    <div class="tooltip-wrapper" :style="{ left: mousePositionX + 'px', top: mousePositionY + 'px' }">
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                mousePositionX: 0,
                mousePositionY: 0
            };
        },
        mounted() {
            document.addEventListener("mousemove", this.onMouseMove);
        },
        beforeDestroy() {
            document.removeEventListener("mousemove", this.onMouseMove);
        },
        methods: {
            /**
             * @param {MouseEvent} event
             */
            onMouseMove(event) {
                this.mousePositionX = event.clientX;
                this.mousePositionY = event.clientY;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .tooltip-wrapper {
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 3;
        width: 180px;
        height: 120px;
        transform: translateX(-100px) translateY(-120px);
        pointer-events: none;

        .content {
            text-align: center;
            background: #0b5a66b3;
            -webkit-backdrop-filter: blur(5px);
            backdrop-filter: blur(5px);
            padding: 0.5rem;
            border-radius: 0.5rem;
            color: white;
            box-shadow: 0 15px 15px -13px rgba(0, 0, 0, 0.5);
            font-size: 0.8rem;
        }
    }
</style>
