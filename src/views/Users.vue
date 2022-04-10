<template>
  <div class="users">
    <v-container class="my-5">
      <v-data-table :headers="headers" :items="clients" :loading="loadingData" :search="search" sort-by="name" @dblclick:row="editFullUser"  :footer-props="footerProps" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title class="font-weight-bold text-h5">Liste de clients</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Chercher" single-line hide-details></v-text-field>
            <v-spacer></v-spacer>
            <template>
              <v-btn color="primary" dark class="mb-2" :to="{name:'adduser'}">
                Ajouter client
              </v-btn>
            </template>
            <!-- Show delete warning dialog -->
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline text-subtitle-1">Êtes-vous sûr de vouloir supprimer ce contact ?</v-card-title>
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
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>

         <template v-slot:[`item.mobile`]="{ item }">
          {{item.mobile}} / {{item.fixe}}
        </template>

        <v-data-footer :items-per-page-options="[10,30,60,100]"></v-data-footer>
      </v-data-table>

      <v-snackbar v-model="toaster.snackbar" :timeout="toaster.timeout" color="deep-purple accent-4" elevation="24">
        {{ toaster.text }}
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import db from '@/firebase/api'
import algoindex from '@/algolia/clientsIndices'
import firebase from 'firebase'
export default {
  data: () => ({
    footerProps: { 'items-per-page-options': [30, 50, 100] },
    search: '',
    loadingData: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Entreprise', align: 'start', value: 'company' },
      { text: 'Prénom', value: 'name' },
      { text: 'Nom', value: 'surname' },
      { text: 'Téléphone / Fixe', value: 'mobile' },
      { text: 'Adresse', value: 'address.address1' },
      { text: 'Localité', value: 'address.locality' },
      { text: 'Email', value: 'email' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    clients: [],
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

      db.collection('clients').get()
        .then(snapshot => {
          snapshot.forEach(document => {
            const clients = document.data()
            clients.id = document.id
            this.clients.push(clients)
          })
        })
      this.loadingData = false
    },
    editFullUser (selectedUser) {
      // get item id and send via router prop to manage page
      this.$router.push({ name: 'manageuser', params: { client_id: selectedUser.item.id } })
    },
    editItem (selectedUser) {
      // get item id and send via router prop to manage page
      this.$router.push({ name: 'edituser', params: { client_data: selectedUser, client_id: selectedUser.id } })
    },
    deleteItem (item) {
      this.editedIndex = this.clients.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      try {
        const deletedUser = this.clients[this.editedIndex]
        await db.collection('clients').doc(deletedUser.id).delete()
        await algoindex.deleteObjects([deletedUser.id])
        const statsRef = db.collection('stats').doc('stats')
        await statsRef.update({
          'total-clients': firebase.firestore.FieldValue.increment(-1)
        })
        this.clients.splice(this.editedIndex, 1)
        this.closeDelete()
        this.toaster.snackbar = true
        this.toaster.text = `${deletedUser.company ? deletedUser.company : deletedUser.name} a été effacé(e).`
      } catch (err) {
        console.log(err)
      }
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
}
</script>
