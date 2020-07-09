<template>
  <div id="app">
    <Game v-if="authenticated"/>
    <Authenticator/>
  </div>
</template>

<script>
  import Game from "./components/Game";
  import Authenticator from "./components/Authenticator";

  export default {
    name: "App",
    components: {
      Game,
      Authenticator
    },
    computed: {
      authenticated() {
        return this.$store.state.authToken;
      }
    }
};
</script>

<style lang="scss">
  body {
    margin: 0;
    font-size: 16px;
  }

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
}
</style>
