<template>
  <div class="manage-ticket">
    <v-row v-if="ticket" id="section-to-print" class="section-to-print-ticket">
      <v-col cols="12" md="5" id="ticket-info">
        <v-card class="pa-5 ma-5">
          <v-card-text class="pb-0">
            <p class="display-1 text--primary font-weight-bold">
              Ticket N° {{ticket.ticketID}}
              <v-btn v-if="ticket.state != 'Fermé'" id="section-not-to-print" depressed fab absolute small right direction="bottom" @click="modifyTicket">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
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
                  <td class="py-3" style="white-space: pre-line;">{{ticket.description}}</td>
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
                <tr class="client-name" @click="openClientProfile">
                  <td>Nom :</td>
                  <td class="py-3">{{ticket.user.name}} {{ticket.user.surname}}</td>
                </tr>
              </tbody>
            </v-simple-table>
            <template>
              <hr style="width:100%; border:1px dashed gray" class="mb-5" />
              <div id="section-not-to-print">
              <v-file-input v-if="ticket.state != 'Fermé'"  accept="image/*" :loading="imageLoading" clearable label="Importer une/des image(s)" @change="uploadPhotos" multiple dense></v-file-input>
              </div>
              <p class="tm-5">Image(s) : </p>
              <v-row justify="center" v-if="gallery != []">
                <template v-for="(img,i) in reversedGallery">
                  <div class="gallery" :key="i">
                    <v-img class="mini-images" :src="img.urlImage" width="150px" height="150px" @click="selectImage(img,i)" />
                  </div>
                </template>
                <v-dialog v-model="dialog" v-if="dialog" width="80%">
                  <v-card>
                    <v-card-text>
                      <img :src="selectedImage.urlImage" width="100%" />
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn v-if="ticket.state != 'Fermé'" color="red" text @click="deletePhoto">
                        Effacer
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-row>
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
      <p class="pagebreak" id="section-to-print">&nbsp;</p>
      <v-col cols="12" md="7" id="history-info">
        <v-card class="pa-5 ma-5">
           <v-btn v-if="ticket.state != 'Fermé'" id="section-not-to-print" depressed fab absolute small right direction="bottom" @click="hideNav">
                <v-icon>mdi-printer</v-icon>
              </v-btn>
          <v-card-text class="pb-0">
            <p class="display-1 text--primary font-weight-bold">
              Historique
            </p>

            <v-row id="section-not-to-print">
              <v-col cols="12" md="2">
                <p class="text--primary mb-0 mt-3" >
                  Afficher :
                </p>
              </v-col>
              <v-col cols="12" md="10">
                <v-select v-model="defaultCommentType" :items="commentTypes" label="selectionner" single-line dense chips class="state-select-panel" @change="showCommentChanged"></v-select>
              </v-col>
            </v-row>
            <v-timeline dense clipped>
              <v-timeline-item fill-dot class="white--text mb-12" color="blue" large id="section-not-to-print">
                <template v-slot:icon>
                  <span>
                    <v-icon color="white">mdi-message-text-outline</v-icon>
                  </span>
                </template>
                <v-textarea v-if="ticket.state != 'Fermé'" v-model="historyComment" label="Commentaire..." solo>
                </v-textarea>
                <span v-else>
                  <v-tooltip bottom>
                    <template slot="activator" slot-scope="{ on }">
                      <p class="black--text" v-on="on">Ce ticket est archivé.</p>
                    </template>
                    <span>Pour pouvoir le modifier, il faut changer l'état du ticket</span>
                  </v-tooltip>
                </span>
                <v-row v-if="ticket.state != 'Fermé'">
                  <v-col cols="12" md="6">
                    <v-btn class="mx-0 font-weight-bold comment-button" color="green" block dark depressed @click="comment('public')">
                      Ajouter(publique)
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-btn class="mx-0 font-weight-bold comment-button" color="blue" block dark depressed @click="comment('private')">
                      Ajouter(privé)
                    </v-btn>
                  </v-col>
                </v-row>
              </v-timeline-item>
              <v-slide-x-transition v-if="events" group>
                <v-timeline-item v-for="(event,i) in timeline" :key="i" class="mb-4" color="green" small style="display:flex;flex-wrap:wrap;">
                  <v-row justify="space-between" style="align-items: center;">
                    <v-col>
                      <v-card elevation="1">
                        <v-card-text class="black--text" style="white-space: pre-line">{{event.message}}</v-card-text>
                        <v-card-actions style="justify-content: end;" class="text-caption grey--text text--lighten-1">
                          <v-chip v-if="event.private" color="blue" class="mr-3 lighten-1" dark small>Privé</v-chip>{{getDataTimeMS(event.created.at)}} | {{event.created.by.name}} {{event.created.by.surname}} <div id="section-not-to-print"> <v-btn v-if="ticket.state != 'Fermé'" icon @click="deleteEvent(i)" color="red lighten-2">
                            <v-icon size="20">mdi-trash-can-outline</v-icon>
                          </v-btn>
                          </div>
                        </v-card-actions>
                      </v-card>
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
    historyData: null,
    imageLoading: false,
    gallery: [],
    defaultCommentType: 'Tout',
    commentTypes: ['Tout', 'Privé', 'Publique'],
    selectedCommentType: null,
    filteredEvents: []
  }),
  created () {
    this.initialize()
  },
  computed: {
    timeline () {
      return this.filteredEvents
    },
    reversedGallery () {
      return this.gallery.slice().reverse()
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
        }
        )

      this.events = this.ticket.history

      if (this.ticket.history) {
        console.log(Object.keys(this.ticket.history).length)
        this.events = []
        for (let i = 0; i < Object.keys(this.ticket.history).length; i++) {
          this.events.push(
            {
              created: {
                at: this.ticket.history[i].created.at,
                by: {
                  name: this.ticket.history[i].created.by.name,
                  surname: this.ticket.history[i].created.by.surname,
                  techID: this.ticket.history[i].created.by.techID
                }
              },
              message: this.ticket.history[i].message,
              private: this.ticket.history[i].private
            }
          )
        }

        this.filteredEvents = this.events
      }
      console.log(this.events)
      if (this.ticket.images || !this.ticket.images === '') {
        for (var element in this.ticket.images) {
          var image = this.ticket.images[element]
          this.gallery.push({ pathToStorage: image.pathToStorage, urlImage: image.urlImage })
        }
      }
    },
    modifyTicket () {
      this.$router.push({ name: 'editticket', params: { ticket_id: this.$route.params.ticket_id } })
    },
    openClientProfile () {
      this.$router.push({ name: 'manageuser', params: { client_id: this.ticket.user.id } })
    },
    async deleteEvent (index) {
      try {
        this.events.reverse().splice([index], 1)
        this.events = this.events.slice().reverse()

        await db.collection('tickets').doc(this.$route.params.ticket_id).update({
          history: this.events
        }, { merge: true })
      } catch (err) {
        console.log(err)
      }
    },
    async deletePhoto () {
      try {
        this.gallery.splice(this.gallery.findIndex(v => v.urlImage === this.selectedImage.urlImage), 1)
        this.dialog = false

        const storageRef = await firebase.storage().ref().child(this.selectedImage.pathToStorage)
        await storageRef.delete()

        await db.collection('tickets').doc(this.$route.params.ticket_id).update({
          images: this.gallery
        }, { merge: true })
      } catch (err) {
        console.log(err)
      }
    },
    async uploadPhotos (photos) {
      // Upload images to firestore
      console.log(photos)
      try {
        this.imageLoading = true
        for (let i = 0; i < photos.length; i++) {
          const storageRef = firebase.storage().ref(`/tickets/${this.ticket.id}/${photos[i].name}`)

          var uploadSnapshot = await storageRef.put(photos[i])
          const fileURL = await storageRef.getDownloadURL()

          this.gallery.push({ urlImage: fileURL, pathToStorage: uploadSnapshot.metadata.fullPath })

          console.log(uploadSnapshot)
          console.log('uploading images to firestore')
        }

        await db.collection('tickets').doc(this.$route.params.ticket_id).update({
          images: this.gallery
        }, { merge: true })
        this.imageLoading = false
      } catch (err) {
        console.log(err)
        this.imageLoading = false
      }
    },
    selectImage (img) {
      this.dialog = true
      this.selectedImage = img
    },
    getDataTimeUnix (time) {
      return moment.unix(time).format('DD-MM-YY à HH:mm:ss')
    },
    getDataTimeMS (time) {
      return moment(time).format('DD-MM-YY à HH:mm:ss')
    },
    async comment (typeOfComment) {
      if (!this.historyComment) return
      try {
        const currentLogedInUserID = await firebase.auth().currentUser.uid
        const technicianFullName = await db.collection('technician').doc(currentLogedInUserID).get()
        const allHistory = await db.collection('tickets').doc(this.$route.params.ticket_id).get()
        const getCurrentServerTime = +new Date()

        if (allHistory.data().history) {
          const allPastHistory = allHistory.data().history
          this.historyData = {
            history: [...allPastHistory,
              {
                created: {
                  at: getCurrentServerTime,
                  by: {
                    techID: currentLogedInUserID,
                    ...technicianFullName.data()
                  }
                },
                message: this.historyComment,
                private: typeOfComment === 'private'
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
                message: this.historyComment,
                private: typeOfComment === 'private'
              }
            ]
          }
        }

        await db.collection('tickets').doc(this.$route.params.ticket_id).update(this.historyData, { merge: true })

        // If events is undefined, initiate an empty array
        if (!this.events) {
          this.events = []
        }
        const newEvent = {
          created: {
            at: getCurrentServerTime,
            by: {
              techID: currentLogedInUserID,
              ...technicianFullName.data()
            }
          },
          message: this.historyComment,
          private: typeOfComment === 'private'
        }
        this.events.push(
          newEvent
        )
        this.filteredEvents.push(newEvent)
        this.filteredEvents = this.filteredEvents.slice().reverse()
      } catch (err) {
        console.log(err)
      }
      this.historyComment = null
    },
    showCommentChanged (showComment) {
      switch (showComment) {
        case 'Privé':
          this.filteredEvents = this.events.filter(event => event.private === true).slice().reverse()
          break
        case 'Publique':
          this.filteredEvents = this.events.filter(event => event.private !== true).slice().reverse()
          break
        case 'Tout':
          this.filteredEvents = this.events.slice().reverse()
          break
      }
    },
    hideNav () {
      this.$root.$emit('HideSideBar')
      window.print()
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
.manage-ticket .gallery .mini-images:hover,
.manage-ticket .client-name {
  cursor: pointer;
}

@media print {
  body * {
    visibility: hidden;
  }
  #section-to-print, #section-to-print * {
    visibility: visible;
  }
  #section-to-print {
    position: absolute;
    left: 0;
    top: 0;
  }
  #section-not-to-print, #section-not-to-print *{
    visibility: hidden;
    display: none;
  }

  #ticket-info{
    width:100% !important
  }
   #history-info{
    width:100% !important
  }
  .section-to-print-ticket{
    margin-top: -90px !important;
    display: grid !important;
    grid-template-columns: 100vw !important;
  }
.pagebreak {
        clear: both !important;
        page-break-after: always !important;
    }
}

@media screen and (max-width: 800px) and (orientation: portrait) {
  .v-timeline-item__divider {
    display: none !important;
  }
  .v-timeline--dense .v-timeline-item__body {
    max-width: 100% !important;
  }
  .v-timeline::before {
    display: none !important;
  }
}
</style>
