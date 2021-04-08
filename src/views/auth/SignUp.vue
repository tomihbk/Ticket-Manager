<template>
  <div class="signup-container">
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

        <h1>Sign Up</h1>
        <v-form ref="form" class="mt-5 mx-5 signup-form" @submit.prevent="signup">
          <v-text-field v-model="name" label="Nom" :rules="[rules.required]" filled></v-text-field>
          <v-text-field v-model="surname" label="Prénom" :rules="[rules.required]" filled></v-text-field>
          <v-text-field type="email" v-model="email" label="Email" :rules="[rules.required, rules.email]" filled></v-text-field>
          <v-text-field type="password" v-model="password" :rules="[rules.required,rules.strongPassword]" label="Mot de Passe" filled></v-text-field>
          <v-text-field type="password" v-model="confirmpassword" :rules="[rules.required, rules.identic]" label="Confirmation du mot de passe" filled></v-text-field>
          <v-btn large color="green" dark depressed @click="validate"><span class="font-weight-bold">créer un compte</span> </v-btn>
          <p class="feedback">
            {{this.feedback}}
          </p>
        </v-form>
        <hr style="margin:1.5em;color:red;border:.2px solid #d5d5d5;" />
        <span>Vous avez déjà un compte</span>
        <p></p>
        <v-btn depressed outlined right color="green" to="login">Se connecter</v-btn>
      </v-sheet>
    </v-container>
  </div>
</template>

<script>
import db from '@/firebase/api'
import firebase from 'firebase'

export default {
  name: 'signup',
  data () {
    return {
      name: null,
      surname: null,
      email: null,
      password: null,
      confirmpassword: null,
      feedback: null,
      rules: {
        required: value => !!value || 'Champ obligatoire',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'E-mail Invalide'
        },
        strongPassword: value => {
          const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/
          console.log(pattern.test(value))
          return pattern.test(value) || 'Minimum 5 caractères, au moins une lettre majuscule, une lettre minuscule et un chiffre'
        },
        identic: () => {
          return this.password === this.confirmpassword || 'Les mots de passes ne sont pas identiques'
        }
      }
    }
  },
  methods: {
    validate () {
      this.$refs.form.validate()

      if (!this.rules.required(this.name) &&
      !this.rules.required(this.surname) &&
      !this.rules.email(this.email) &&
      !this.rules.strongPassword(this.password) &&
      !this.rules.identic(this.confirmpassword)) {
        return
      }
      this.signup()
    },
    async signup () {
      try {
        const createdUser = await firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        await db.collection('technician').doc(createdUser.user.uid).set({
          name: this.name,
          surname: this.surname
        })
        this.$router.push({ name: 'login' })
      } catch (err) {
        console.log(err)
        if (err.code === 'auth/email-already-in-use' || err.message === 'EMAIL_EXISTS') {
          this.feedback = "L'email est déjà enregistré dans le système"
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
.signup-form,
hr {
  width: 80%;
}
h1:nth-child(2) {
  margin-bottom: 1em;
}

.signup-container {
  /*background-image: url("https://walker-web.imgix.net/cms/Gradient_builder_2.jpg");*/
  background-image: url("https://products.ls.graphics/mesh-gradients/images/08.-Violet-Blue.jpg");
  background-position: center left;
  height: 100vh;
}

.signup-container  .feedback{
    color: red;
margin-top: 2em;
margin-bottom: 0;
  }
</style>
