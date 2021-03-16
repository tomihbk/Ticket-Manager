<template>
  <div class="manage-ticket">
    <v-row>
      <v-col cols="12" md="5" v-if="ticket">
        <v-card class="pa-5 ma-5">
          <v-card-text class="pb-0">
            <p class="display-1 text--primary font-weight-bold">
              Ticket N° {{ticket.ticketID}}

              <v-chip v-if="ticket.priority" class="ma-2" small color="red" text-color="white">
                IMPORTANT
                <v-icon right>
                  mdi-star
                </v-icon>
              </v-chip>
            </p>
            <p>Information :</p>
            <v-simple-table class="mb-5">
              <tbody>
                <tr>
                  <td>Titre :</td>
                  <td class="py-3">{{ticket.title}}</td>
                </tr>
                <tr>
                  <td>Catégorie :</td>
                  <td class="py-3">{{ticket.type}}</td>
                </tr>
                <tr>
                  <td>Description :</td>
                  <td class="py-3" style="white-space: pre;">{{ticket.description}}</td>
                </tr>
                <tr>
                  <td>Crée :</td>
                  <td class="py-3">{{getDataTimeUnix(ticket.created.at.seconds)}} <br /> Par {{ticket.created.by.name}} {{ticket.created.by.surname}}</td>
                </tr>
                <tr>
                  <td>État :</td>
                  <td class="py-3">{{ticket.state}}</td>
                </tr>
              </tbody>
            </v-simple-table>
            <hr style="width:100%; border:1px dashed gray" class="mb-5" />
            <p class="tm-5">Client(e) :</p>
            <v-simple-table class="mb-5">
              <tbody>
                <tr>
                  <td>Nom :</td>
                  <td class="py-3">{{ticket.user.name}} {{ticket.user.surname}}</td>
                </tr>
              </tbody>
            </v-simple-table>
            <template v-if="ticket.images">
              <hr style="width:100%; border:1px dashed gray" class="mb-5" />
              <p class="tm-5">Image(s) :</p>
              <div class="gallery">
                <v-dialog v-model="dialog" width="80%">
                  <template v-slot:activator="{ on, attrs }">
                    <span color="red lighten-2" dark v-bind="attrs" v-on="on" @click="selectImage(img)" v-for="(img,i) in ticket.images" :key="i">
                      <v-img class="mini-images" :src="img.urlImage" width="150px" height="150px" />
                    </span>
                  </template>
                  <v-card>
                    <v-card-text v-if="selectedImage">
                      <v-img :src="selectedImage.urlImage" />
                    </v-card-text>
                    <v-divider style="width:100%"></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red" text @click="dialog = false">
                        Effacer
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </template>
            <template v-if="ticket.signature">
              <hr style="width:100%; border:1px dashed gray" class="my-5" />
              <p class="tm-5">Signature :</p>
              <div>
                <v-img :src="ticket.signature.urlImage" width="300px" />
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="7">
        <v-card class="pa-5 ma-5">
          <v-card-text class="pb-0">
            <p class="display-1 text--primary font-weight-bold">
              Historique
            </p>
            <v-timeline dense clipped>
              <v-timeline-item fill-dot class="white--text mb-12" color="blue" large>
                <template v-slot:icon>
                  <span>
                    <v-icon color="white">mdi-message-text-outline</v-icon>
                  </span>
                </template>
                <v-textarea v-model="historyComment" label="Commentaire..." solo>
                  <template v-slot:append>
                    <v-btn class="mx-0 font-weight-bold" color="blue" dark depressed @click="comment">
                      ajouter
                    </v-btn>
                  </template>
                </v-textarea>
              </v-timeline-item>
              <v-slide-x-transition v-if="events" group>
                <v-timeline-item v-for="(event,i) in timeline" :key="i" class="mb-4" color="green" small>
                  <v-row justify="space-between" style="align-items: center;">
                    <v-col cols="7" style="white-space: pre;" v-text="event.message"></v-col>
                    <v-col class="text-right" cols="5">
                      {{getDataTime(event.created.at)}}
                      <br />{{event.created.by.name}} {{event.created.by.surname}}
                    </v-col>
                  </v-row>
                </v-timeline-item>
              </v-slide-x-transition>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import moment from 'moment'
import db from '@/firebase/api'
import firebase from 'firebase'
export default {
  data: () => ({
    ticket: null,
    dialog: false,
    selectedImage: null,
    events: [],
    historyComment: null,
    historyData: null
  }),
  beforeMount () {
    this.initialize()
  },
  computed: {
    timeline () {
      return this.events.slice().reverse()
    }
  },
  methods: {
    async initialize () {
      console.log('This is gonna cost ya')

      await db.collection('tickets').doc(this.$route.params.ticket_id).get()
        .then(document => {
          const ticket = document.data()
          ticket.id = document.id
          this.ticket = ticket
          if (ticket.history) {
            this.events = ticket.history
          } else {
            this.events = []
          }
        })
    },
    selectImage (img) {
      this.selectedImage = img
    },
    getDataTimeUnix (time) {
      return moment.unix(time).format('DD-MM-YY à HH:mm:ss')
    },
    getDataTime (time) {
      return moment(time).format('DD-MM-YY à HH:mm:ss')
    },
    async comment () {
      if (!this.historyComment) return
      try {
        const currentLogedInUserID = await firebase.auth().currentUser.uid
        const technicianFullName = await db.collection('technician').doc(currentLogedInUserID).get()
        const allHistory = await await db.collection('tickets').doc(this.$route.params.ticket_id).get()
        const getCurrentServerTime = +new Date()

        if (allHistory.data().history) {
          this.historyData = {
            history: [...allHistory.data().history,
              {
                created: {
                  at: getCurrentServerTime,
                  by: {
                    techID: currentLogedInUserID,
                    ...technicianFullName.data()
                  }
                },
                message: this.historyComment
              }
            ]
          }
        } else {
          this.historyData = {
            history: [
              {
                created: {
                  at: getCurrentServerTime,
                  by: {
                    techID: currentLogedInUserID,
                    ...technicianFullName.data()
                  }
                },
                message: this.historyComment
              }
            ]
          }
        }

        await db.collection('tickets').doc(this.$route.params.ticket_id).update(this.historyData, { merge: true })

        this.events.push(
          {
            created: {
              at: getCurrentServerTime,
              by: {
                techID: currentLogedInUserID,
                ...technicianFullName.data()
              }
            },
            message: this.historyComment
          }
        )
      } catch (err) {
        console.log(err)
      }

      this.historyComment = null
    }
  }
}
</script>

<style>
.manage-ticket .gallery {
  display: flex;
  flex-wrap: wrap;
}
.manage-ticket .gallery .mini-images {
  margin: 10px;
}
</style>
