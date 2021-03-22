<template>
  <div class="addticket-container">
    <v-container fluid fill-height>
      <v-sheet color="white" elevation="1" class="container ticket-sheet rounded-lg" align="center">
        <h1 class="mb-5">Créer un ticket</h1>
        <v-form ref="form" class="mt-5 mx-5 signup-form" @submit.prevent="validate">
          <v-row>
            <v-col cols="12" md="12">
              <ais-instant-search :search-client="searchClient" :index-name="algoliaIndexName">
                <ais-search-box placeholder="Chercher le client" v-model="fieldname"/>
                <ais-autocomplete>
                  <div slot-scope="{ currentRefinement, indices}">
                    <template v-if="currentRefinement">
                      <v-card class="mx-auto resultcard" tile v-for="index in indices" :key="index.indexId" :class="{'selectedClient' : isSelected}">
                        <template v-if="index">
                          <v-list-item v-for="(hit,i) in index.hits" :key="hit.objectID" @click="getObjectid(index.hits,i)">
                            <v-list-item-content>
                              <v-list-item-title>
                                <ais-highlight attribute="name" :hit="hit" />
                                &nbsp;
                                <ais-highlight attribute="surname" :hit="hit" />
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-card>
                    </template>
                  </div>
                </ais-autocomplete>
              </ais-instant-search>
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field type="text" v-model="ticketData.title" label="Titre" :rules="[rules.required]" dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-select v-model="ticketData.type" :items="tickettype" :rules="[rules.required]" label="Catégorie" required></v-select>
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea type="text" v-model="ticketData.description" label="Description de problème" :rules="[rules.required]" dense></v-textarea>
            </v-col>
            <v-col cols="12" md="12">
              <span class="mb-5"> Signature : </span>
              <v-btn rounded color="primary" class="blue lighten-3 black--text" depressed @click="signPadIsShown=!signPadIsShown">{{signPadIsShown ? 'Cacher' :'Afficher'}} la boîte de signature</v-btn>
              <p v-if="signPadIsShown">
                <VueSignaturePad id="signPad" width="100%" height="300px" ref="signaturePad" class="mt-5" :class="{'signPadError' : signaturePadError}"></VueSignaturePad><v-btn @click="clearSignature">effacer</v-btn>
              </p>
            </v-col>
            <v-col cols="12" md="12">
              <v-file-input accept="image/*" label="Importer une/des image(s)" @change="previewFiles" multiple dense></v-file-input>
            </v-col>
          </v-row>
          <v-btn large color="green" :loading="loading" dark depressed @click="validate" class="mt-5"><span class="font-weight-bold">créer ticket</span> </v-btn>
          <p class="feedback">
            {{this.feedback}}
          </p>
        </v-form>
      </v-sheet>
    </v-container>
  </div>
</template>

<script>
import db from '@/firebase/api'
import firebase from 'firebase'
import algoliaTicket from '@/algolia/ticketsIndices'
import * as algoliasearch from 'algoliasearch'

export default {
  data () {
    return {
      signPadIsShown: false,
      signaturePadError: false,
      tickettype: ['Graphisme', 'Informatique', 'Web', 'Imprimerie'],
      fieldname: '',
      isSelected: false,
      algoliaIndexName: process.env.VUE_APP_ALGOLIA_INDEX_CLIENTS,
      searchClient: algoliasearch(process.env.VUE_APP_ALGOLIA_APP_ID,
        process.env.VUE_APP_ALGOLIA_API_KEY),
      ticketData: {
        ticketID: null,
        user: {
          id: null
        },
        title: null,
        type: null,
        description: null,
        signature: null,
        images: null,
        created: null,
        state: null,
        priority: null
      },
      uploadedImages: null,
      loading: false,
      feedback: null,
      rules: {
        required: value => !!value || 'Champ obligatoire'
      }
    }
  },
  methods: {
    getObjectid (id, index) {
      if (id) {
        console.log(id[index])
        this.ticketData.user = id[index].objectID
        this.isSelected = true
        this.fieldname = `${id[index].name} ${id[index].surname}`
      }
    },
    async previewFiles (files) {
      this.uploadedImages = files
      this.ticketData.images = []
    },
    clearSignature () {
      this.$refs.signaturePad.clearSignature()
    },
    async validate () {
      this.$refs.form.validate()

      if (this.signPadIsShown) {
        const { isEmpty } = this.$refs.signaturePad.saveSignature()
        if (!isEmpty) {
          this.signaturePadError = false
        } else {
          this.signaturePadError = true
        }
      }

      // Checks if all needed data aren't null
      if (!this.ticketData.title || !this.ticketData.type || !this.ticketData.description || this.signaturePadError || !this.ticketData.user) {
        this.feedback = 'Les champs : client, titre, catégorie, description, (signature, si boîte est affichée), doivent être remplis.'
      } else {
        this.feedback = null

        const statsRef = db.collection('stats').doc('stats')
        const statsDoc = await statsRef.get()
        const ticketDocID = await db.collection('tickets').doc()
        // Adding unique ID ticket that will be human readable format
        this.ticketData.ticketID = statsDoc.data()['last-ticket-number']

        const currentLogedInUserID = firebase.auth().currentUser.uid
        const technicianFullName = await db.collection('technician').doc(currentLogedInUserID).get()
        const clientFullName = await db.collection('clients').doc(this.ticketData.user).get()
        // Creation time will be server's date
        this.ticketData.created = {
          at: await firebase.firestore.FieldValue.serverTimestamp(),
          by: { id: currentLogedInUserID, ...technicianFullName.data() }
        }

        this.ticketData.user = {
          id: this.ticketData.user,
          surname: await clientFullName.data().surname,
          name: await clientFullName.data().name
        }

        this.ticketData.state = 'Nouveau'
        this.ticketData.priority = false

        try {
          this.loading = true

          // Upload images to firestore
          if (this.ticketData.images) {
            for (let i = 0; i < this.uploadedImages.length; i++) {
              const storageRef = firebase.storage().ref(`/tickets/${ticketDocID.id}/${this.uploadedImages[i].name}`)
              var uploadSnapshot = await storageRef.put(this.uploadedImages[i])
              const fileURL = await storageRef.getDownloadURL()
              this.ticketData.images.push({ urlImage: fileURL, pathToStorage: uploadSnapshot.metadata.fullPath })
              console.log(uploadSnapshot)
              console.log('uploading images to firestore')
            }
          } else {
            console.log('no pics to upload')
          }

          // upload signature image
          if (this.signPadIsShown) {
            const { isEmpty, data } = this.$refs.signaturePad.saveSignature()
            if (!isEmpty) {
              this.signaturePadError = false
              const storageRef = firebase.storage().ref(`/tickets/${ticketDocID.id}/signature.png`)
              const signURL = await storageRef.putString(data, 'data_url')

              const fileURL = await storageRef.getDownloadURL()
              this.ticketData.signature = {
                urlImage: fileURL,
                pathToStorage: signURL.metadata.fullPath
              }
              console.log('signature uploaded')
            } else {
              this.signaturePadError = true
              console.log('signature not uploaded')
            }
          }

          // This removes null data recursivly from javascript objects
          const dataWithoutNull = Object.fromEntries(
            Object.entries(this.ticketData)
              .filter(([_, v]) => v != null)
              .map(([k, v]) => [k, v === Object(v) ? Object.fromEntries(Object.entries(v).filter(([_, v]) => v != null)) : v])
          )// Data has been cleaned
          // Sending all ticketdata
          await ticketDocID.set(dataWithoutNull)
          await statsRef.update({
            'last-ticket-number': firebase.firestore.FieldValue.increment(1),
            'total-opened-tickets': firebase.firestore.FieldValue.increment(1)
          })
          console.log('last-ticket-number updated')
          // Fetch Id generated by firebase and assign the id to the object and will be used for algolia
          dataWithoutNull.objectID = ticketDocID.id

          await algoliaTicket.saveObjects([dataWithoutNull])
          console.log('Sent to aloglia')
          this.loading = false
          this.$router.push({ name: 'tickets' })
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
.addticket-container .feedback {
  color: red;
  margin-top: 2em;
  margin-bottom: 0;
}
.addticket-container .ais-InstantSearch {
  width: 100% !important;
}
.addticket-container .selectedClient {
  background-color: rgba(119, 255, 137, 0.548);
}
.addticket-container .resultcard:hover {
  cursor: pointer;
}
.addticket-container #signPad {
  border: 1px solid black;
}
.addticket-container .signPadError {
  border: 2px solid red !important;
}
</style>
