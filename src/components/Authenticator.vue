<template>
  <div v-if="!authenticated" class="authenticator">
    <div class="wrapper">
      <div class="container">
        <div class="error" v-if="error">{{ error }}</div>
        <form @submit.prevent="authenticate" v-if="!loading">
          <p>
            <label for="username">Username</label>
            <input type="text" v-model="username" id="username">
          </p>
          <p>
            <label for="password">Password</label>
            <input type="password" v-model="password" id="password">
          </p>
          <button type="submit">Log In</button>
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
      error: undefined
    };
  },
  computed: {
    authenticated() {
      return this.$store.state.authToken;
    },
    inputValid() {
      return this.password.length > 7 && this.username;
    },
    loading() {
      return this.$store.getters.busy;
    }
  },
  methods: {
    async authenticate() {
      if (!this.inputValid) this.error = "Please fill out the form.";
      try {
        await this.$store.dispatch("AUTHENTICATE", {
          username: this.username,
          password: this.password
        });
      } catch (e) {
        console.log("[Authenticator] Login error: ", e);
        this.error = "Wrong credentials.";
      }
    }
  }
};
</script>

<style scoped>
.authenticator {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}
.wrapper {
  display: flex;
  width: 100%;
  height: 100vh;
}
.container {
  background: white;
  width: 100%;
  max-width: 240px;
  margin: auto;
  padding: 1rem;
  border-radius: 0.5rem;
}
form p label {
  display: block;
}
form p input {
  display: block;
  width: 100%;
}
.error {
  color: red;
}
</style>

