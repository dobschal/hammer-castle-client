<template>
  <div id="app">
    <Game v-if="authenticated"/>
    <StartPage/>
  </div>
</template>

<script>
  import Game from "./components/Game";
  import StartPage from "./components/StartPage";

  export default {
    name: "App",
    components: {
      Game,
      StartPage
    },
    computed: {
      authenticated() {
        return this.$store.state.authToken;
      }
    }
};
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');
  body {
    margin: 0;
    font-size: 16px;
    font-family: 'MedievalSharp', cursive;
    letter-spacing: 1.5px;
  }

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
    font-size: 16px;
    font-family: 'MedievalSharp', cursive;
    letter-spacing: 1.5px;
  }

  button {
    padding: 0.5rem 2rem;
    border: none;
    border-radius: 0.25rem;
    background: rgba(11, 90, 102, 0.7);
    backdrop-filter: blur(5px);
    color: white;
    font-weight: bold;
    transition: transform 0.3s ease-out;

    &:hover {
      cursor: pointer;
      transform: scale(1.05);
    }

    &:active {
      cursor: pointer;
      transform: scale(0.95);
    }
  }

  .link {
    color: rgb(11, 90, 102);

    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
</style>
