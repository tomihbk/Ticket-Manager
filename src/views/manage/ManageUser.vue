<template>
  <div class="manage-ticket">
    <v-row v-if="client">
      <v-col cols="12" md="5">
        <v-card class="pa-5 ma-5">
          <v-card-text class="pb-0">
            <p class="display-1 text--primary font-weight-bold">
              <span v-if="client.company">{{client.company}}<br /></span>
              {{client.name}} {{client.surname}}
              <v-btn depressed fab absolute small right direction="bottom" @click="modifyClient">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </p>
            <p>Information :</p>
            <v-simple-table class="mb-5">
              <tbody>
                <tr v-if="client.address">
                  <td>Adresse :</td>
                  <td class="py-3">
                    <span v-if="client.address.address1">{{client.address.address1}}<br></span>
                    <span v-if="client.address.address2">{{client.address.address2}}<br></span>
                    <span v-if="client.address.npa">{{client.address.npa}}</span> <span v-if="client.address.locality">{{client.address.locality}}</span>
                  </td>
                </tr>
                <tr v-if="client.mobile">
                  <td>Mobile :</td>
                  <td class="py-3"><a :href="`tel:${client.mobile}`">{{client.mobile}}</a></td>
                </tr>
                <tr v-if="client.fixe">
                  <td>Tel. fixe :</td>
                  <td class="py-3"><a :href="`tel:${client.fixe}`">{{client.fixe}}</a></td>
                </tr>
                <tr v-if="client.email">
                  <td>Email :</td>
                  <td class="py-3"><a :href="`mailto:${client.email}`">{{client.email}}</a></td>
                </tr>
                <tr v-if="client.created">
                  <td>Crée :</td>
                  <td class="py-3" style="white-space: pre-line;">{{getDataTimeUnix(client.created.at.seconds)}}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="7">
        <v-card class="pa-5 ma-5">
          <v-card-text class="pb-0">
            <p class="display-1 text--primary font-weight-bold">
              Historique des travaux
            </p>

            <div v-if="ticketList != []">
              <template v-for="(ticket,i) in ticketList">
                <v-card :key="i" @click="editTicket(ticket.id)" class="mt-5 blue lighten-5" elevation="1" rounded>
                  <v-card-title>
                    Ticket N° {{ticket.ticketID}}
                  </v-card-title>
                  <v-card-text class="pb-5 black--text">
                    Crée : {{ticket.created.at.seconds}}<br />
                    Titre : {{ticket.title}}<br />
                    État : <v-chip>{{ticket.state}}</v-chip>
                  </v-card-text>
                </v-card>
              </template>
            </div>
            <div v-else class="black--text">Pas de travaux...</div>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </div>
</template>

<script>

import moment from 'moment'
import db from '@/firebase/api'
export default {
  data: () => ({
    client: null,
    ticketList: []
  }),
  created () {
    this.initialize()
  },
  methods: {
    async initialize () {
      await db.collection('clients').doc(this.$route.params.client_id).get()
        .then(document => {
          const client = document.data()
          client.id = document.id
          this.client = client
        })

      await db.collection('tickets').where('user.id', '==', this.$route.params.client_id).get()
        .then(snapshot => {
          snapshot.forEach(document => {
            const tickets = document.data()
            tickets.id = document.id
            tickets.created.at.seconds = moment.unix(document.data().created.at.seconds).format('DD-MM-YYYY à HH:mm')
            this.ticketList.push(tickets)
          })
        })
    },
    modifyClient () {
      this.$router.push({ name: 'edituser', params: { client_id: this.$route.params.client_id } })
    },
    editTicket (ticketID) {
      // get item id and send via router prop to manage page
      this.$router.push({ name: 'manageticket', params: { ticket_id: ticketID } })
    },
    getDataTimeUnix (time) {
      return moment.unix(time).format('DD-MM-YY à HH:mm:ss')
    },
    getDataTimeMS (time) {
      return moment(time).format('DD-MM-YY à HH:mm:ss')
    }
  }
}
</script>

<style>
</style>
