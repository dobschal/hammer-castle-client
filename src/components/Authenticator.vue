<template>
  <div v-if="!authenticated" class="authenticator">
    <div class="wrapper">
      <div class="container">
        <div v-if="showRegistration">
          <h2>Come in!</h2>
          <p>Hammer Castle is waiting for you!</p>
        </div>
        <div v-else>
          <h2>Welcome back!</h2>
          <p>Login with your username and password!</p>
        </div>
        <div class="error" v-if="error">{{ error }}</div>
        <form @submit.prevent="authenticate" v-if="!loading">
          <p>
            <label for="username">Username</label>
            <input type="text" v-model="username" id="username" autofocus>
          </p>
          <p>
            <label for="password">Password</label>
            <input type="password" v-model="password" id="password">
          </p>
          <p v-if="showRegistration">
          <label for="password-verify">Verify Password</label>
          <input type="password" v-model="passwordVerify" id="password-verify">
        </p>
          <p v-if="showRegistration">
            <label for="user-color">Your Color</label>
            <span id="user-color" :style="{ 'background-color': randomColor }"></span>
            <span class="link generate-color-link" @click="newColor">Change Color</span>
          </p>
          <div v-if="showRegistration">
            <button type="submit">Create Account</button>
            or <span class="link" @click="showRegistration = false">log in</span>
          </div>
          <div v-else>
            <button type="submit">Log In</button>
            or <span class="link" @click="showRegistration = true">Create Account</span>
          </div>
        </form>
        <div v-else>Loading...</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Authenticator",
  data() {
    return {
      password: "",
      username: "",
      passwordVerify: "",
      error: undefined,
      showRegistration: false,
      randomColor:  "#" + Math.floor(Math.random()*16777215).toString(16)
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
  methods: {
    newColor() {
      this.randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
    },
    async authenticate() {
      if (!this.inputValid) {
        this.error = "Please fill out the form. Your password should contain at least 8 characters.";
        return;
      }
      try {
        await this.$store.dispatch(this.showRegistration ? "CREATE_USER" : "AUTHENTICATE", {
          username: this.username,
          password: this.password,
          color: this.randomColor
        });
        if(this.showRegistration) {
          this.showRegistration = false;
        }
      } catch (e) {
        console.log("[Authenticator] Login error: ", e);
        this.error = "Wrong credentials.";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .authenticator {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-image: url("../assets/bg-image-castle.jpg");
    background-size: cover;

    .wrapper {
      display: flex;
      width: 100%;
      height: 100vh;
      background-color: rgba(0,0,0, 0.3);
      backdrop-filter: blur(3px);

      .container {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(5px);
        width: 100%;
        max-width: 480px;
        margin: auto;
        padding: 2rem;
        border-radius: 0.5rem;

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

