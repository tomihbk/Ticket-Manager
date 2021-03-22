<template>
  <div class="forgotPassword">
      <p class="text-h4">Demande de réintilisation de mot de passe</p>
    <v-card class="my-5">
      <v-card-text>

          <v-form ref="form">
                  <v-text-field type="email" v-model="email" label="Votre email" :rules="[rules.required, rules.email]" filled></v-text-field>
                  </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green" text @click="submit" :loading="loading">
          Envoyer
        </v-btn>
      </v-card-actions>
    </v-card>
    <p class="feedback mt-5" :class="{'feedback-green':greenFeedback}">
 {{feedback}}
        </p>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'ForgotPasswordForm',
  data: () => ({
    email: null,
    loading: false,
    feedback: null,
    greenFeedback: false,
    rules: {
      required: value => !!value || 'Champ obligatoire',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'E-mail Invalide'
      }
    }
  }),
  methods: {
    async submit () {
      this.$refs.form.validate()

      if (!this.email) {
        return false
      }

      try {
        this.loading = true
        await firebase.auth().sendPasswordResetEmail(this.email)
        this.greenFeedback = true
        this.feedback = `La demande pour réinitialiser votre mot de passe à  été envoyée sur ${this.email}`
        this.loading = false
      } catch (err) {
        this.greenFeedback = this.loading = false
        console.log(err)
        switch (err.code) {
          case 'auth/user-not-found':
            this.feedback = 'Utilisateur n\'est pas dans notre système'
            break
          default:
            break
        }
      }
    }
  }
}
</script>

<style>
.forgotPassword{
    width:80%;
    margin:0 auto;
}
.forgotPassword .feedback{
    text-align: center;
    color:red
}
.forgotPassword .feedback-green{
    text-align: center;
    color:green
}
</style>
