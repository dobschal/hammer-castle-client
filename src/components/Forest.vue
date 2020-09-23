<template>

    <svg :x="position.x - size" :y="position.y - size" xmlns="http://www.w3.org/2000/svg"
         :width="size * 2" :height="size * 2" fill="none">
        <g class="K">
            <circle cx="150" cy="150" r="150" fill-opacity=".05"/>
        </g>
        <image href="../assets/trees.png" height="200" width="200" x="50" y="50"/>

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
