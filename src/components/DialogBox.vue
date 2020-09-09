<template>
    <div class="dialog-container">
        <div class="dialog-wrapper">
            <div class="dialog-content">
                <img src="../assets/icon-hand-writing.svg" alt="yeah">
                <h3>Choose a name for your Castle!</h3>
                <input type="text" v-model="input" placeholder="Burg der Burgen" autofocus/>
                <div class="icons">
                    <img src="../assets/icon-cancel.svg" alt="yeah" @click="cancel">
                    <img src="../assets/icon-ok.svg" alt="yeah" @click="submit">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DialogBox",
        data() {
            return {input: ""};
        },
        methods: {
            cancel() {
                this.$emit("CLOSE");
            },
            submit() {
                if (!this.input) return;
                this.$emit("SUBMIT", this.input);
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
                max-width: 320px;
                width: 80%;
                text-align: center;
                background-color: rgba(0, 0, 0, 0.2);
                padding: 2rem;
                border-radius: 25px;
                box-shadow: 0 0 150px 150px rgba(0, 0, 0, 0.2);

                img {
                    display: block;
                    margin: 0 auto;
                    width: 120px;
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
                    background-color: rgba(255, 255, 255, 0.7);
                    color: black;
                    padding: 0 8px;
                    line-height: 40px;
                }

                .icons {
                    width: 80%;
                    margin: 1.5rem auto;
                    display: flex;
                    flex-direction: row;

                    img {
                        display: block;
                        width: 20%;
                        opacity: 0.8;
                        transition: opacity 0.5s ease-out, transform 0.2s;

                        &:hover {
                            transform: scale(1.1);
                            opacity: 1;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
</style>
