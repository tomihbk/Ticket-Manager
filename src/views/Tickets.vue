<template>
  <div class="tickets">
    <v-container class="my-5">
      <v-data-table :headers="headers" :items="tickets" :loading="loadingData" :search="search" sort-by="priority" :sortDesc="true" :footer-props="footerProps" @dblclick:row="editItem" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title class="font-weight-bold text-h5">Liste de tickets</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Chercher" single-line hide-details></v-text-field>
            <v-spacer></v-spacer>
            <template>
              <v-btn color="primary" dark class="mb-2" :to="{name:'addticket'}">
                Ajouter Ticket
              </v-btn>
            </template>
            <!-- Show delete warning dialog -->
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline text-subtitle-1">Êtes-vous sûr de vouloir supprimer ce ticket ?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Annuler</v-btn>
                  <v-btn color="red darken-1" text @click="deleteItemConfirm">OUI</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

          </v-toolbar>
        </template>
        <template v-slot:[`item.state`]="{ item }" width="100px">
          <v-select v-model="item.state" :items="ticketState" label="Selectionner" return-object single-line chips class="state-select-panel" @change="stateChanged(item.id,item.state, item.oldstate,false)"></v-select>
        </template>

        <template v-slot:[`item.type`]="{ item }">
          <v-chip :color="getColor(item.type)" dark>
            {{ item.type }}
          </v-chip>
        </template>

        <template v-slot:[`item.priority`]="{ item }">
          <v-checkbox v-model="item.priority" color="red" on-icon="mdi-star" off-icon="mdi-star-outline" @change="setPriority(item.id,item.priority)"></v-checkbox>
        </template>
        <template v-slot:[`item.user`]="{ item }">
          {{item.user.name}} {{item.user.surname}}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="modifyTicket(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteTicket(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>

      <v-snackbar v-model="toaster.snackbar" :timeout="toaster.timeout" color="deep-purple accent-4" elevation="24">
        {{ toaster.text }}
      </v-snackbar>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import db from '../firebase/api'
import algoindex from '../algolia/clientsIndices'
import moment from 'moment'
import firebase from 'firebase'
import openedTicketCountHandler from '../util/openedTicketCountHandler'

export default Vue.extend({
  data: () => ({
    ticketState: ['Nouveau', 'En cours', 'En attente de commande', 'En attente de client', 'A facturé', 'Fermé'],
    footerProps: { 'items-per-page-options': [30, 50, 100] },
    search: '',
    loadingData: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Id', align: 'start', value: 'ticketID' },
      { text: 'Type', value: 'type' },
      { text: 'Prénom', value: 'user.name' },
      { text: 'Nom', value: 'user.surname' },
      { text: 'Titre', value: 'title' },
      { text: 'Date de création', value: 'created.at.seconds' },
      { text: 'État', value: 'state' },
      { text: 'Priorité', value: 'priority' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    tickets: [] as firebase.firestore.DocumentData,
    editedItem: {},
    editedIndex: {},
    defaultItem: {},
    toaster: {
      snackbar: false,
      text: '',
      timeout: 3000
    }
  }),

  watch: {
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.loadingData = true

      db.collection('tickets').where('state', '!=', 'Fermé').get()
        .then(snapshot => {
          snapshot.forEach(document => {
            const tickets = document.data()
            tickets.id = document.id
            tickets.created.at.seconds = moment.unix(document.data().created.at.seconds).format('DD-MM-YYYY à HH:mm')
            this.tickets.push(tickets)
          })
        })

      this.loadingData = false
    },
    getColor (category:string) {
      switch (category) {
        case 'Informatique':
          return 'red'
        case 'Web':
          return 'orange'
        case 'Graphisme':
          return 'green'
        case 'Imprimerie':
          return 'blue'
        default:
          return 'white'
      }
    },
    modifyTicket (selectedTicket:any) {
      this.$router.push({ name: 'editticket', params: { ticket_id: selectedTicket.id } })
    },
    async stateChanged (ticketFirebaseId:string, currentState:string, oldState:string, isIncremented:boolean) {
      await openedTicketCountHandler(ticketFirebaseId, currentState, oldState, isIncremented)
    },
    async setPriority (ticketFirebaseId:string, priority:boolean) {
      try {
        await db.collection('tickets').doc(ticketFirebaseId).update({
          priority: priority
        })
      } catch (err) {
        console.log(err)
      }
    },
    editItem (mousevent:MouseEvent, selectedTicket:any) {
      // get item id and send via router prop to manage page
      this.$router.push({ name: 'manageticket', params: { ticket_id: selectedTicket.item.id } })
    },
    deleteTicket (selectedTicket:number) {
      this.editedIndex = this.tickets.indexOf(selectedTicket)
      this.editedItem = Object.assign({}, selectedTicket)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      const deletedTicket = this.tickets[this.editedIndex as number]
      // await db.collection('tickets').doc(deletedTicket.id).delete()
      this.tickets.splice(this.editedIndex, 1)
      this.closeDelete()
      this.toaster.snackbar = true
      this.toaster.text = `Ticket N°${deletedTicket.ticketID} a été effacé.`
      if (deletedTicket.images) {
        for (let i = 0; i < Object.keys(deletedTicket.images).length; i++) {
          const storageRef = firebase.storage().ref().child(`${deletedTicket.images[i].pathToStorage}`)

          // Delete the files
          await storageRef.delete().then(() => {
            console.log('images successfully deleted')
          }).catch((error) => {
            console.log(error)
          })
        }
      }

      if (deletedTicket.signature) {
        const storageRef = firebase.storage().ref().child(`${deletedTicket.signature.pathToStorage}`)
        // Delete the files
        await storageRef.delete().then(() => {
          console.log('signature successfully deleted')
        }).catch((error) => {
          console.log(error)
        })
      }
      const statsRef = db.collection('stats').doc('stats')
      await statsRef.update({
        'total-opened-tickets': firebase.firestore.FieldValue.increment(-1)
      })

      await db.collection('tickets').doc(deletedTicket.id).delete()
      await algoindex.deleteObjects([deletedTicket.id])
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    }
  }
})
</script>
<style>
.tickets .state-select-panel {
  width: 230px !important;
  font-size: 0.875rem;
}
</style>
