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

          <!-- Elément ne s'affiche pas si feedback est null -->
          <p class="feedback" v-if="feedback">
            {{this.feedback}}
          </p>
        </v-form>
        <hr style="margin:1.5em;color:red;border:.2px solid #d5d5d5;" />
        <span>Vous n'avez pas encore un compte</span>
        <p></p>
        <v-btn depressed outlined right color="green" to="signup">créer un compte</v-btn>
      </v-sheet>
    </v-container>
  </div>
</template>

<script>
// eslint-disable-next-line
import db from '@/firebase/api'
import firebase from 'firebase'

export default {
  name: 'login',
  data () {
    return {
      email: null,
      password: null,
      feedback: null,
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
      this.$refs.form.validate()
      console.log(this.email)
      console.log(this.password)

      if (!this.password || !this.email) {
        return false
      }
      console.log('validated')
      this.login()
    },
    async login () {
      try {
        this.feedback = null
        await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        this.$router.push({ name: 'dashboard' })
      } catch (err) {
        console.log(err)
        switch (err.code) {
          case 'auth/user-not-found':
            this.feedback = "L'utilisateur n'existe pas."
            break

          case 'auth/wrong-password':
            this.feedback = 'Mot de passe incorrect.'
            break

          case 'auth/invalid-email':
            this.feedback = "L'email est mal saisi."
            break

          default:
            break
        }
      }
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
  background-image: url("https://walker-web.imgix.net/cms/Gradient_builder_2.jpg");
  background-position: center left;
  height: 100vh;
}

.login-container  .feedback{
    color: red;
margin-top: 2em;
margin-bottom: 0;
  }
</style>
