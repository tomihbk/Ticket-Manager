<template>
  <div class="editticket-container">
    <v-container fluid fill-height>
      <v-sheet color="white" elevation="1" class="container ticket-sheet rounded-lg" align="center">
        <h1 class="mb-5">Modifier ticket N° {{ticketData.ticketID}}</h1>
        <v-form ref="form" class="mt-5 mx-5 signup-form" @submit.prevent="updateTicket">
          <v-row>
            <v-col cols="12" md="12">
              <ais-instant-search v-if="!ticketData.signature" :search-client="searchClient" :index-name="algoliaIndexName">
                <ais-search-box placeholder="Chercher le client" v-model="fieldname" />
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
              <span v-else>
                <p class="text-h5 font-weight-bold green--text">{{ticketData.user.name}} {{ticketData.user.surname}}</p>
                Ce ticket contient une signature, donc il n'est pas possible de changer le client.
              </span>
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field type="text" v-model="ticketData.title" label="Titre" :rules="[rules.required]" dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-select v-model="ticketData.type" :items="tickettype" :rules="[rules.required]" label="Catégorie" required></v-select>
            </v-col>
              <v-col cols="12" sm="12">
              <v-select v-model="ticketData.state" :items="ticketState" :rules="[rules.required]" label="État" required></v-select>
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea type="text" v-model="ticketData.description" label="Description de problème" :rules="[rules.required]" dense></v-textarea>
            </v-col>
          </v-row>
          <v-btn large color="green" :loading="loading" dark depressed @click="updateTicket" class="mt-5"><span class="font-weight-bold">mettre à jour ticket</span> </v-btn>
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
import algoliaTicket from '@/algolia/ticketsIndices'
import * as algoliasearch from 'algoliasearch'
import RemoveNullData from '../../util/removeNullData'

export default {
  data () {
    return {
      tickettype: ['Graphisme', 'Informatique', 'Web', 'Imprimerie'],
      ticketState: ['Nouveau', 'En cours', 'En attente de commande', 'En attente de client', 'A facturé', 'Fermé'],
      fieldname: '',
      isSelected: false,
      algoliaIndexName: process.env.VUE_APP_ALGOLIA_INDEX_CLIENTS,
      searchClient: algoliasearch(process.env.VUE_APP_ALGOLIA_APP_ID,
        process.env.VUE_APP_ALGOLIA_API_KEY),
      ticketData: {
        user: {
          id: null
        },
        title: null,
        type: null,
        description: null
      },
      loading: false,
      feedback: null,
      rules: {
        required: value => !!value || 'Champ obligatoire'
      }
    }
  },
  beforeMount () {
    this.initialize()
  },
  methods: {
    async initialize () {
      await db.collection('tickets').doc(this.$route.params.ticket_id).get()
        .then(document => {
          const ticket = document.data()
          this.ticketData = ticket
          this.ticketData.user.id = ticket.user.id
          this.isSelected = true
          this.fieldname = `${ticket.user.name} ${ticket.user.surname}`
        })
    },
    getObjectid (id, index) {
      if (id) {
        this.ticketData.user.id = id[index].objectID
        this.isSelected = true
        this.fieldname = `${id[index].name} ${id[index].surname}`
      }
    },
    async updateTicket () {
      this.$refs.form.validate()

      // Checks if all needed data aren't null
      if (!this.ticketData.title || !this.ticketData.type || !this.ticketData.description || !this.ticketData.user) {
        this.feedback = 'Les champs : client, titre, catégorie, description, doivent être remplis.'
      } else {
        this.feedback = null

        const ticketDocID = await db.collection('tickets').doc(this.$route.params.ticket_id)
        const clientFullName = await db.collection('clients').doc(this.ticketData.user.id).get()

        this.ticketData.user = {
          id: this.ticketData.user.id,
          surname: await clientFullName.data().surname,
          name: await clientFullName.data().name
        }

        try {
          this.loading = true

          const dataWithoutNull = RemoveNullData(this.ticketData)

          // Sending all ticketdata
          await ticketDocID.update(dataWithoutNull)

          // Fetch Id generated by firebase and assign the id to the object and will be used for algolia
          dataWithoutNull.objectID = ticketDocID.id

          await algoliaTicket.saveObjects([dataWithoutNull])
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
