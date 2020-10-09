<template>
    <div class="info-view">
        <p>In the browser game Hammer Castle you build castles to build your own great empire.</p>
        <img class="empire" src="../../assets/info/empire.png" alt="Banner">

        <h3>Castles</h3>
        <img class="castle" src="../../assets/info/castle.png" alt="Castle">
        <p>Castles are the central element of the game. To build a castle, you need hammers. The price is shown in
            button
            “Build Castle for …”.
            The more castles you own, the more hammers you get.
            But your storage has a limit. The limit of hammers you can store depends on the amount of warehouses you
            own.</p>

        <h3>Warehouses</h3>
        <img src="../../assets/info/warehouse.png" alt="Warehouse">
        <p>Warehouses store your hammers. Click on a road between two of your castle and select “Build Warehouse for …”.
            The more warehouses you have, the more hammers you can store.</p>
        <p>
            Be careful, if one of your castles next to the warehouse gets conquered or destroyed, the warehouse gets
            destroyed too!</p>

        <h3>Conquers</h3>
        <img class="conquer" src="../../assets/info/conquer.png" alt="Conquer">
        <p>To conquer an opponents castle, you simply need to attach more roads at the castle than your opponent.
            The level shown at a castle, is the amount of owned roads connected to it.</p>

        <h3>Catapults</h3>
        <img class="catapult" src="../../assets/info/catapult.png" alt="Catapult">
        <p>To destroy a castle, you can build a catapult on a road next to an opponents castle. The catapult has chance
            to
            destroy the castle, depending on the castles level.</p>
        <p>
            Try it out and have fun!</p>
        <p style="clear:right;"></p>
    </div>
</template>

<style lang="scss" scoped>
    .info-view {
        img {
            float: right;
            display: block;
            margin-left: 1rem;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 25px 25px -25px black;
            margin-right: -4rem;
            margin-bottom: 4rem;

            &.castle {
                width: 45%;
            }

            &.conquer {
                width: 70%;
            }

            &.catapult {
                width: 60%;
            }

            &.empire {
                width: 100%;
                margin: 0 0 4rem 0;
            }

            @media only screen and (max-width: 1024px) {
                float: none;
                width: initial;
                max-width: 100%;
                margin: 0 auto;
            }
        }

        h3 {
            clear: right;
            margin-top: 2rem;
            display: block;
        }
    }
</style>
