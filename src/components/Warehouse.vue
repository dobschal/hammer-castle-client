<template>
    <svg :x="position.x - 51" :y="position.y - 40" width="80" height="80" viewBox="0 0 577 826" fill="none" xmlns="http://www.w3.org/2000/svg">
        <image href="../assets/warehouse.png" height="577" width="826" x="0" y="0"/>
    </svg>
</template>

<script>
    export default {
        name: "Warehouse",
        props: {
            color: String,
            position: {
                type: Object,
                validator: value => {
                    return typeof value.x === "number" && typeof value.y === "number";
                }
            }
        },
    };
</script>
