<template>
  <div v-if="!authenticated" class="start-page">
    <div class="wrapper">
      <div class="container" v-if="!loading">
        <div class="logo"><img src="../assets/logo.svg" alt="Hammer Castle Logo"></div>
        <div class="cookie" v-if="showRegistration">This page uses cookies and the local storage of your browser. If you
          disagree with that, do
          not create an account and just leave that page. Further information can be found here: <b class="link"
                                                                                                    @click="openPrivacyPolicy">privacy
            & cookie policy</b></div>
        <div v-if="showRegistration">
          <h2>Come in!</h2>
          <p>Hammer Castle is waiting for you!</p>
          <p>Create an account with username, password and your favorite color and join the game.</p>
        </div>
        <div v-else>
          <h2>Welcome back!</h2>
          <p>Login with your username and password!</p>
        </div>
        <div class="error" v-if="error">{{ error }}</div>
        <form @submit.prevent="authenticate" v-if="!loading">
          <p>
            <label for="username">Username</label>
            <input type="text" v-model="username" id="username" autofocus autocomplete="username">
          </p>
          <p>
            <label for="password">Password</label>
            <input type="password" v-model="password" id="password" :autocomplete="showRegistration ? 'new-password' : 'current-password'">
          </p>
          <p v-if="showRegistration">
          <label for="password-verify">Verify Password</label>
          <input type="password" v-model="passwordVerify" id="password-verify" autocomplete="new-password">
        </p>
          <p v-if="showRegistration">
            <label for="user-color">Your Color</label>
            <span id="user-color" :style="{ 'background-color': randomColor }"></span>
            <span class="link generate-color-link" @click="newColor">Change Color</span>
          </p>
          <div v-if="showRegistration">
            <div class="toggle"
                 :class="{ toggled: privacyPolicyAccepted }"
                 @click="togglePrivacyAccept">
              You need to read and accept the <b class="link" @click="openPrivacyPolicy">privacy & cookie policy</b> in
              order to create a new account.
            </div>
            <button type="submit">Create Account</button>
            or <span class="link" @click="showRegistration = false">log in</span>
          </div>
          <div v-else>
            <button type="submit">Log In</button>
            or <span class="link" @click="showRegistration = true">Create Account</span>
          </div>
        </form>
        <hr>
        <div>
          <h2>What is Hammer Castle?</h2>
          <InfoView></InfoView>
        </div>
        <div>
          <h2>Changelog</h2>
          <p>Version 1.0.0 is live!</p>
        </div>
        <div>
          <h2>Imprint</h2>
          <p>© 2020, Sascha Dobschal. The game Hammer Castle was created and is an idea of Sascha Dobschal.</p>
          <p>Contact: info@hammercastle.de
            <br> <b class="link" @click="openImprint">Imprint</b> | <b class="link" @click="openPrivacyPolicy">Privacy &
              Cookie
              Policy</b></p>
        </div>
      </div>
      <div v-else>Loading...</div>
    </div>
    <PageOverlay v-if="pageOverlayOpen && pageOverlayType === 'imprint'"
                 title="Impressum"
                 @CLOSE="closePage">
      <Imprint></Imprint>
    </PageOverlay>
    <PageOverlay v-if="pageOverlayOpen && pageOverlayType === 'privacy'"
                 title="Privacy & Cookie Policy"
                 @CLOSE="closePage">
      <PrivacyPolicy></PrivacyPolicy>
    </PageOverlay>
  </div>
</template>

<script>
  import InfoView from "./pages/Info";
  import Imprint from "./pages/Imprint";
  import PrivacyPolicy from "./pages/PrivacyPolicy";
  import PageOverlay from "./PageOverlay";

  function randomColor() {
    let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    while (color.length < 7) {
      color += "f";
    }
    return color;
  }

  export default {
    name: "Authenticator",
    components: {InfoView, PageOverlay, Imprint, PrivacyPolicy},
    data() {
      return {
        password: "",
        username: "",
        passwordVerify: "",
        error: undefined,
        showRegistration: Boolean(window.localStorage.getItem("was-here-before") !== "yes"),
        randomColor: randomColor(),
        pageOverlayOpen: false,
        pageOverlayType: "",
        privacyPolicyAccepted: false
      };
    },
    computed: {
      authenticated() {
        return this.$store.state.authToken;
      },
      inputValid() {
        return (!this.showRegistration || this.password === this.passwordVerify) && this.password.length > 7 && this.username;
      },
      loading() {
        return this.$store.getters.busy;
      }
    },
    created() {
      window.localStorage.setItem("was-here-before", "yes");
    },
    methods: {
      togglePrivacyAccept() {
        console.log("[StartPage] yeah: ", this.privacyPolicyAccepted);
        this.privacyPolicyAccepted = !this.privacyPolicyAccepted;
      },
      openPrivacyPolicy() {
        this.pageOverlayOpen = true;
        this.pageOverlayType = "privacy";
      },
      openImprint() {
        this.pageOverlayOpen = true;
        this.pageOverlayType = "imprint";
      },
      closePage() {
        this.pageOverlayOpen = false;
        this.pageOverlayType = "";
      },
      newColor() {
        this.randomColor = randomColor();
      },
      async authenticate() {
        if (!this.inputValid) {
          this.error = "Please fill out the form. Your password should contain at least 8 characters.";
          return;
        }
        this.error = undefined;
        if (this.showRegistration && !this.privacyPolicyAccepted) {
          this.error = "You need to read and accept the privacy policy.";
          return;
        }
        try {
          await this.$store.dispatch(this.showRegistration ? "CREATE_USER" : "AUTHENTICATE", {
            username: this.username,
            password: this.password,
            color: this.randomColor
          });
          if (this.showRegistration) {
            this.showRegistration = false;
          }
        } catch (e) {
          console.log("[Authenticator] Login error: ", e);
          this.error = e.response.data.message;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>

  .toggle {
    margin-bottom: 1rem;

    &::before {
      content: "✓";
      font-size: 0;
      line-height: 0;
      display: block;
      float: left;
      width: 20px;
      height: 20px;
      margin: 0.5rem 1rem 0.5rem 0;
      border: 1px solid black;
      border-radius: 50%;
      text-align: center;
    }

    &.toggled {
      &::before {
        font-size: 30px;
        line-height: 15px;
      }
    }

    &:hover {
      cursor: pointer;

      &::before {
        font-size: 30px;
        line-height: 15px;
      }
    }
  }

  .start-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-image: url("../assets/bg-image-castle.jpg");
    background-size: cover;
    font-family: 'Piazzolla', serif !important;
    letter-spacing: initial;

    .cookie {
      font-size: 0.7rem;
      line-height: 0.9rem;
      background-color: rgba(242, 112, 255, 0.41);
      padding: 0.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 25px 25px -25px rgba(0, 0, 0, 0.3);
    }

    .wrapper {
      width: 100%;
      height: 100vh;
      padding: 2rem 0;
      background-color: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(3px);
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;

      .container {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(5px);
        width: 100%;
        max-width: 480px;
        margin: 0 auto 5rem auto;
        padding: 2rem;
        border-radius: 0.5rem;
        box-sizing: border-box;

        hr {
          margin: 2rem -2rem;
          border: none;
          border-bottom: solid 1px #0b5a66b3;
        }

        .logo img {
          width: 200px;
          display: block;
          border-radius: 5px;
          margin: 0 auto;
        }

        form p label {
          display: block;
          font-weight: bold;
        }

        form p input {
          display: block;
          width: 100%;
        }

        #user-color {
          display: inline-block;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          box-shadow: 15px 15px 15px -15px rgba(0,0,0,0.3);
        }

        .generate-color-link {
          display: inline-block;
          line-height: 55px;
          vertical-align: top;
          margin-left: 8px;
        }

        .error {
          color: red;
        }
      }
    }
  }
</style>

