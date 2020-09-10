<template>
    <div class="wrapper">
        <div class="buttons">
            <div class="icon-value-pair">
                <span class="icon"><img src="../assets/icon-hammer.svg" alt="Hammer"></span>
                <span class="value">{{ hammer }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TopNavigationBar",
        computed: {
            hammer() {
                return this.$store.state.user ? this.$store.state.user.hammer : 0;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .wrapper {
        position: fixed;
        top: 4rem;
        left: 50%;
        z-index: 2;
        width: 120px;
        margin-left: -60px;
        text-align: center;

        .buttons {
            .icon-value-pair {
                background-color: rgba(6, 45, 51, 0.5);
                box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.2);
                padding: 0.6rem 1rem;
                border-radius: 8px;
                display: flex;
                flex-direction: row;
                align-items: center;

                .icon {
                    width: 24px;
                    display: block;
                    margin: auto;

                    img {
                        width: 100%;
                    }
                }

                .value {
                    margin: auto;
                    color: white;
                    display: block;
                }
            }
        }

    }
</style>
