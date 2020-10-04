<template>

    <!-- TODO: this should be the castle menu only --->

    <div class="dialog-container">
        <div class="dialog-wrapper">
            <div class="dialog-content">
                <template v-if="type === DialogType.MAIN_MENU">
                    <div class="navigation">
                        <div class="item" @click="type = DialogType.CHANGE_NAME">Change Castle Name</div>
                        <div class="item" @click="deleteCastle">Destroy</div>
                        <div class="item" @click="cancel">Close</div>
                    </div>
                </template>
                <template v-else-if="type === DialogType.CHANGE_NAME">
                    <img src="../assets/icon-hand-writing.svg" alt="yeah">
                    <h3>Choose a name for your Castle</h3>
                    <input :class="{ error: Boolean(error) }" type="text"
                           v-model="input" placeholder="Burg der Burgen" @keydown="error = ''"
                           @keypress.enter="changeName"
                           autofocus/>
                    <div class="error" v-if="error">{{ error }}</div>
                    <div class="icons">
                        <img src="../assets/icon-cancel.svg" alt="yeah" @click="type = DialogType.MAIN_MENU">
                        <img src="../assets/icon-ok.svg" alt="yeah" @click="changeName">
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "DialogBox",
        props: {
            latestClickedCastle: Object
        },
        data() {

            const DialogType = Object.freeze({
                "MAIN_MENU": "MAIN_MENU",
                "CHANGE_NAME": "CHANGE_NAME"
            });

            return {
                DialogType,
                input: "",
                error: "",
                type: DialogType.MAIN_MENU
            };
        },
        watch: {
            type() {
                if (this.type === this.DialogType.CHANGE_NAME) {
                    this.input = this.latestClickedCastle.name;
                }
            }
        },
        methods: {
            cancel() {
                this.$emit("CLOSE");
            },
            changeName() {
                if (!this.input || this.input.length > 12) {
                    this.error = "Please insert a valid castle name! Max length is 12 characters.";
                    return;
                }
                console.log("[Game] New castle name fro: ", this.input, this.latestClickedCastle);
                this.$store.dispatch("CHANGE_CASTLE_NAME", {
                    x: this.latestClickedCastle.x,
                    y: this.latestClickedCastle.y,
                    name: this.input
                });
                this.$emit("CLOSE");
            },
            deleteCastle() {

                // TODO: Error handling and dialog?

                this.$store.dispatch("DELETE_CASTLE", {
                    x: this.latestClickedCastle.x,
                    y: this.latestClickedCastle.y
                });
                this.$store.dispatch("GET_CASTLE_PRICE");
                this.$store.dispatch("GET_CATAPULT_PRICE");
                this.$emit("CLOSE");
            }
        }
    };
</script>

<style lang="scss" scoped>
    .dialog-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9;
        background-color: rgba(0, 0, 0, 0.5);

        .dialog-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100vw;
            height: 100vh;

            .dialog-content {
                margin: auto;
                max-width: 400px;
                width: 80%;
                text-align: center;
                background-color: rgba(0, 0, 0, 0.2);
                padding: 2rem;
                border-radius: 25px;
                box-shadow: 0 0 150px 150px rgba(0, 0, 0, 0.2);

                img {
                    display: block;
                    margin: 0 auto;
                    width: 100px;
                }

                h3 {
                    color: white;
                    font-size: 200%;
                }

                input {
                    display: block;
                    width: 100%;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    background-color: rgba(255, 255, 255, 0.9);
                    color: black;
                    padding: 0 8px;
                    line-height: 40px;

                    &.error {
                        border: solid 1px red;
                    }
                }

                .error {
                    color: #ff6d69;
                    margin-top: 1rem;
                }

                .icons {
                    width: 80%;
                    margin: 1.5rem auto;
                    display: flex;
                    flex-direction: row;

                    img {
                        display: block;
                        width: 25%;
                        opacity: 0.8;
                        transition: opacity 0.5s ease-out, transform 0.2s;

                        &:hover {
                            transform: scale(1.1);
                            opacity: 1;
                            cursor: pointer;
                        }
                    }
                }

                .navigation {
                    .item {
                        color: white;
                        font-size: 150%;
                        padding: 1.5rem 1rem;
                        border-bottom: solid 3px rgba(255, 255, 255, 1);

                        &:hover {
                            cursor: pointer;
                            background-color: rgba(255, 255, 255, 0.1);
                        }

                        &:last-child {
                            border-bottom: none;
                        }
                    }
                }
            }

            // end .dialog-content
        }
    }
</style>
