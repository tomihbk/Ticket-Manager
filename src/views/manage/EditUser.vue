<template>
  <div>
    <div class="adduser-container">
      <v-container fluid fill-height>
        <v-sheet color="white" elevation="1" class="container ticket-sheet rounded-lg" align="center">

          <h1 class="mb-5">Mettre à jour {{clientData.name}} {{clientData.surname}}</h1>
          <v-form ref="form" class="mt-5 mx-5 signup-form" @submit.prevent="validate">
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field type="text" v-model="clientData.company" label="Entreprise" dense></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field type="text" v-model="clientData.name" label="Nom" :rules="[rules.required]" dense></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field type="text" v-model="clientData.surname" label="Prénom" :rules="[rules.required]" dense></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field type="text" v-model="clientData.address.address1" label="Adresse 1" dense></v-text-field>
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field type="text" v-model="clientData.address.address2" label="Adresse 2" dense></v-text-field>
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field type="tel" v-model="clientData.mobile" label="Téléphone mobile" dense></v-text-field>
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field type="tel" v-model="clientData.fixe" label="Téléphone fixe" dense></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field type="tel" v-model="clientData.address.npa" label="NPA" dense counter maxlength="4"></v-text-field>
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field type="text" v-model="clientData.address.locality" label="Localité" dense></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field type="email" v-model="clientData.email" label="email" dense></v-text-field>
              </v-col>
            </v-row>
            <v-btn large color="blue" :loading="loading" dark depressed @click="updateData" class="mt-5"><span class="font-weight-bold">Mettre à jour</span> </v-btn>
            <p class="feedback">
              {{this.feedback}}
            </p>
          </v-form>
        </v-sheet>
      </v-container>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/api'
import algoindex from '@/algolia/clientsIndices'
export default {
  data: () => ({
    firestoreID: null,
    clientData: {
      company: null,
      name: null,
      surname: null,
      address: {
        address1: null,
        address2: null,
        npa: null,
        locality: null
      },
      mobile: null,
      fixe: null,

      email: null
    },
    loading: false,
    feedback: null,
    rules: {
      required: value => !!value || 'Champ obligatoire'
    }

  }),
  created () {
    this.fillData()
  },
  methods: {
    async fillData () {
      await db.collection('clients').doc(this.$route.params.client_id).get()
        .then(document => {
          const clientData = document.data()
          this.firestoreID = document.id

          this.clientData = clientData
          console.log(this.firestoreID)
        }
        )
    },
    async updateData () {
      this.$refs.form.validate()
      if (!this.clientData.name || !this.clientData.surname) {
        this.feedback = 'Les champs nom et prénom doivent être remplis'
      } else {
        this.feedback = null

        // This removed null data recursivly from javascript objects
        const dataWithoutNull = Object.fromEntries(
          Object.entries(this.clientData)
            .filter(([_, v]) => v != null)
            .map(([k, v]) => [k, v === Object(v) ? Object.fromEntries(Object.entries(v).filter(([_, v]) => v != null)) : v])
        )// Data has been cleaned
        try {
          this.loading = true
          await db.collection('clients').doc(this.firestoreID).set(dataWithoutNull)
          dataWithoutNull.objectID = this.firestoreID
          await algoindex.saveObjects([dataWithoutNull])
          this.loading = false
          this.$router.push({ name: 'users' })
        } catch (err) {
          this.loading = false
          console.log(err)
        }
      }
    }
  }
}
</script>

<style>
</style>
