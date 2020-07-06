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

<style>
body {
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
* {
  box-sizing: border-box;
}
</style>
