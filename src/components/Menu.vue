<template>
    <div class="menu-wrapper" @click="$emit('CLOSE-MENU')">
        <div class="menu-container">
            <div class="menu-content" @click.stop>
                <div class="items">
                    <div class="item">Help & Info</div>
                    <div class="item">Ranking</div>
                    <div class="item">Profile</div>
                    <div class="item">Forum</div>
                    <div class="item" @click="$emit('LOGOUT')">Logout</div>
                    <div class="item" @click="$emit('CLOSE-MENU')">Close Menu</div>
                </div>
                <div class="footer">{{ version }} | {{ clientCommitHash }}</div>
            </div>
        </div>
    </div>
</template>

<script>

    import {version} from "../../package";

    export default {
        name: "Menu",
        data() {
            return {
                clientCommitHash: "",
                version
            }
        },
        mounted() {
            fetch("/commit-hash.txt").then(r => r.text()).then(r => {
                this.clientCommitHash = r;
            });
        }
    };
</script>

<style lang="scss" scoped>
    .menu-wrapper {
        position: fixed;
        width: 100vw;
        height: 100vh;
        z-index: 2;
        background-color: rgba(0, 0, 0, 0.5);

        .menu-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100vw;
            height: 100vh;

            .menu-content {
                background-image: url("../assets/papyrus.svg");
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-position: 50% 50%;
                width: 302px;
                height: 394px;
                margin: auto;

                .items {
                    padding: 2rem 3rem;
                    text-align: center;

                    .item {
                        font-size: 1.2rem;
                        padding: 0.77rem 1rem;
                        border-bottom: dashed 2px rgba(0, 0, 0, 0.19);

                        &:last-child {
                            border-bottom: none;
                        }

                        &:hover {
                            color: red;
                            cursor: pointer;
                        }
                    }
                }

                // end .items

                .footer {
                    text-align: center;
                    font-weight: bold;
                    font-size: 66%;
                    color: rgba(0, 0, 0, 0.66);
                }
            }
        }

        // end .menu-container
    }
</style>
