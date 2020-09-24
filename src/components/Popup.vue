<template>
    <div class="popup" :style="{ left: (position.x / zoomFactor) + 'px', top: (position.y / zoomFactor) + 'px' }">
        <div class="items" v-if="type === 'road'">
            <div class="item" @click="buildCatapult">Build a Catapult</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Popup",
        props: {
            type: String,
            item: Object, // depending on type ... might be a road or castle
            zoomFactor: Number,
            position: Object // x, y
        },
        methods: {
            buildCatapult() {
                console.log("[Popup] Build it: ");

                // TODO: Build a catapult!

            }
        }
    }
</script>

<style lang="scss" scoped>
    .popup {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translateY(-170px) translateX(-117px);
        width: 234px;
        height: 173px;
        z-index: 3;
        background-image: url("../assets/popup.svg");
        background-size: 100%;
        background-position: center 30px;
        background-repeat: no-repeat;

        .items {
            padding-top: 3rem;

            .item {
                text-align: center;
                color: white;
                font-size: 1rem;
                font-weight: bold;
                letter-spacing: 1.5px;
                border-bottom: dashed 2px rgba(255, 255, 255, 0.5);
                margin: 0 2.75rem;
                padding-bottom: .25rem;

                &:hover {
                    color: red;
                    cursor: pointer;
                }
            }
        }
    }
</style>
