<template>
  <div class="login-container">
    <v-container fluid fill-height>
      <v-sheet color="white" elevation="1" class="container ticket-sheet rounded-lg" align="center">
        <span class="title-span green--text text--darken-3">
          <h1 class="font-weight-light text-h3 my-5 mr-3 my-xs-0 ">
            Ticket
          </h1>

          <h1 class="font-weight-bold text-h3 my-5">
            Manager
          </h1>
        </span>

        <h1>Login</h1>
        <v-form ref="form" class="ma-5 login-form">
          <v-text-field v-model="email" label="Email" :rules="[rules.required, rules.email]" filled></v-text-field>
          <v-text-field type="password" v-model="password" :rules="[rules.required]" label="Mot de Passe" filled></v-text-field>
          <v-btn large dark color="green" depressed @click="validate">Se Connecter</v-btn>
        </v-form>
        <hr style="margin:1.5em;color:red;border:.2px solid #d5d5d5;" />
        <span>Vous n'avez pas encore un compte</span>
        <p></p>
        <v-btn depressed outlined right color="green">créer un compte</v-btn>
      </v-sheet>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      email: null,
      password: null,
      rules: {
        required: value => !!value || 'Champ obligatoire',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'E-mail Invalide'
        }
      }
    }
  },
  methods: {
    validate () {
      console.log('Validating')
      this.$refs.form.validate()
    }
  }
}
</script>

<style lang="scss">
.title-span {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.ticket-sheet {
  padding: 2em 0;
  max-width: 600px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.login-form,
hr {
  width: 80%;
}
h1:nth-child(2) {
  margin-bottom: 1em;
}
.login-container {
  background: #4e54c8; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to bottom,
    #8f94fb,
    #4e54c8
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    #8f94fb,
    #4e54c8
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  background: -webkit-linear-gradient(
    to right,
    #0cebeb,
    #20e3b2,
    #29ffc6
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #0cebeb,
    #20e3b2,
    #29ffc6
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  background: #2193b0; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to bottom,
    #6dd5ed,
    #2193b0
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    #6dd5ed,
    #2193b0
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  background-image: url("https://walker-web.imgix.net/cms/Gradient_builder_2.jpg");
  /*background-image: url("https://products.ls.graphics/mesh-gradients/images/08.-Violet-Blue.jpg");*/
  background-position: center left;
  height: 100vh;
}
</style>
