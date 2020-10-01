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
    background-color: #b6e57b;
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
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;

    &:hover {
      cursor: pointer;
      transform: scale(1.05);
      background: rgba(11, 75, 87, 0.8);
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

  .tooltip {
    display: block !important;
    z-index: 10000;

    .tooltip-inner {
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border-radius: 16px;
      padding: 1rem;
      max-width: 240px;
      font-size: 0.9rem;
    }

    .tooltip-arrow {
      width: 0;
      height: 0;
      border-style: solid;
      position: absolute;
      margin: 5px;
      border-color: rgba(0, 0, 0, 0.8);
      z-index: 1;
    }

    &[x-placement^="top"] {
      margin-bottom: 5px;

      .tooltip-arrow {
        border-width: 5px 5px 0 5px;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        bottom: -5px;
        left: calc(50% - 5px);
        margin-top: 0;
        margin-bottom: 0;
      }
    }

    &[x-placement^="bottom"] {
      margin-top: 5px;

      .tooltip-arrow {
        border-width: 0 5px 5px 5px;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-top-color: transparent !important;
        top: -5px;
        left: calc(50% - 5px);
        margin-top: 0;
        margin-bottom: 0;
      }
    }

    &[x-placement^="right"] {
      margin-left: 5px;

      .tooltip-arrow {
        border-width: 5px 5px 5px 0;
        border-left-color: transparent !important;
        border-top-color: transparent !important;
        border-bottom-color: transparent !important;
        left: -5px;
        top: calc(50% - 5px);
        margin-left: 0;
        margin-right: 0;
      }
    }

    &[x-placement^="left"] {
      margin-right: 5px;

      .tooltip-arrow {
        border-width: 5px 0 5px 5px;
        border-top-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        right: -5px;
        top: calc(50% - 5px);
        margin-left: 0;
        margin-right: 0;
      }
    }

    &.popover {
      $color: #f9f9f9;

      .popover-inner {
        background: $color;
        color: black;
        padding: 24px;
        border-radius: 5px;
        box-shadow: 0 5px 30px rgba(black, .1);
      }

      .popover-arrow {
        border-color: $color;
      }
    }

    &[aria-hidden='true'] {
      visibility: hidden;
      opacity: 0;
      transition: opacity .15s, visibility .15s;
    }

    &[aria-hidden='false'] {
      visibility: visible;
      opacity: 1;
      transition: opacity .15s;
    }
  }
</style>
