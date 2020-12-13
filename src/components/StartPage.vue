<template>
  <div v-if="!authenticated" class="start-page" ref="start-page">
    <div class="wrapper">
      <div class="container" v-if="!loading">
        <div class="logo"><img src="../assets/logo.svg"
                               alt="Hammer Castle Logo"></div>
        <div class="cookie">
          {{ $t("startPage.privacyPolicy") }}
          <b class="link" @click="openPrivacyPolicy">{{
            $t("startPage.privacyPolicyTitle") }}</b>
        </div>
        <div v-if="showRegistration">
          <h2>Come in!</h2>
          <p>Hammer Castle is waiting for you!</p>
          <p>Create an account with username, password and your favorite color
            and join the game.</p>
        </div>
        <div v-else>
          <h2>Welcome back!</h2>
          <p>Login with your username and password!</p>
        </div>
        <div class="error" v-if="error">{{ error }}</div>
        <form @submit.prevent="authenticate" v-if="!loading">
          <p>
            <label for="username">Username</label>
            <input type="text" v-model="username" placeholder="Enter your username..." id="username" autofocus autocomplete="username">
          </p>
          <p>
            <label for="password">Password</label>
            <input type="password" v-model="password" placeholder="Enter your password..." id="password" :autocomplete="showRegistration ? 'new-password' : 'current-password'">
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
            <br> <b class="link" @click="openImprint">Imprint</b> |
            <b class="link" @click="openPrivacyPolicy">{{
              $t("startPage.privacyPolicyTitle") }}</b></p>
          <br>.
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
      this.loadBackgroundImage();
    },
    methods: {
      loadBackgroundImage() {
        const imageUrl = "/bg-image-castle.jpg";
        let preloaderImg = document.createElement("img");
        preloaderImg.src = imageUrl;
        preloaderImg.addEventListener('load', () => {
          if (this.$refs["start-page"]) {
            this.$refs["start-page"].style.backgroundImage = `url(${imageUrl})`;
            this.$refs["start-page"].style.backgroundPosition = "0";
          }
          preloaderImg = undefined;
        });
      },
      togglePrivacyAccept() {
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
            this.authenticate();
          }
        } catch (e) {
          console.log("[Authenticator] Login error: ", e);
          try {
            this.error = e.response.data.message;
          } catch(e2) {
            this.error = "Seems like the server is down...";
          }
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
        color: rgba(0, 0, 0, 1) !important;
      }
    }

    &:hover {
      cursor: pointer;

      &::before {
        font-size: 30px;
        line-height: 15px;
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }

  .start-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    //background-image: url("../assets/bg-image-castle.jpg");
    background-position: center -100vh;
    background-repeat: no-repeat;
    background-size: cover;
    font-family: 'Piazzolla', serif !important;
    letter-spacing: initial;
    transition: background-position 1s ease-in;

    .cookie {
      font-size: 0.8rem;
      line-height: 1rem;
      background-color: rgba(242, 112, 255, 0.41);
      padding: 0.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 25px 25px -25px rgba(0, 0, 0, 0.3);
    }

    .wrapper {
      width: 100%;
      height: 100vh;
      padding: 2rem 0;
      background-color: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(3px);
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;

      @media only screen and (max-width: 900px) {
        padding: 0;
      }

      .container {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(5px);
        width: 100%;
        max-width: 620px;
        margin: 0 auto 5rem auto;
        padding: 2rem;
        border-radius: 0.5rem;
        box-sizing: border-box;

        @media only screen and (max-width: 900px) {
          border-radius: 0;
          background: rgba(255, 255, 255, 1);
          margin: 0 auto;
        }

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
          width: calc(100% + 0.5rem);
          border: solid 1px #E0E0E0;
          background-color: #f6f6f6;
          padding: 0.5rem;
          border-radius: 0.5rem;
          margin-left: -0.25rem;
          box-sizing: border-box;
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

