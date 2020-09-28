<template>

    <svg :x="position.x - size" :y="position.y - size" xmlns="http://www.w3.org/2000/svg"
         :width="size * 2" :height="size * 2" fill="none">
        <circle :cx="size" :cy="size" :r="size" stroke="none" fill="black" opacity="0.05"/>
        <image href="../assets/trees.png" :height="size * 1.2" :width="size * 1.2" :x="size * 0.4" :y="size * 0.4"/>

    </svg>

</template>

<script>
    export default {
        name: "Forest",
        props: {
            position: {
                type: Object,
                validator: value => {
                    return typeof value.x === "number" && typeof value.y === "number";
                }
            },
            size: Number,
            padding: Number
        }
    };
</script>

<style scoped>

</style>
