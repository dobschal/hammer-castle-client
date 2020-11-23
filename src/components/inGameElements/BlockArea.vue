<template>
        <Mountain v-if="blockArea.type === 'MOUNTAIN'" :position="position" :size="size" :padding="padding"></Mountain>
        <Forest v-else :position="position" :size="size" :padding="padding"></Forest>

</template>

<script>
        import config from "../../config";
        import Forest from "./Forest";
        import Mountain from "./Mountain";

        export default {
                name: "BlockArea",
                components: {Forest, Mountain},
                props: {
                        blockArea: Object,
                        position: {
                                type: Object,
                                validator: value => {
                                        return typeof value.x === "number" && typeof value.y === "number";
                                }
                        }
                },
                created() {
                        console.log("[BlockArea] BlockArea: ", this.blockArea.type);
                },
                data() {
                        return {
                                size: config.BLOCK_AREA_SIZE,
                                padding: 60
                        };
                }
        };

</script>
