<template>
  <nav>
    <v-app-bar flat app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase toolbar-name" @click="goHome">
        <span class="font-weight-light">
          Ticket
        </span>
        <span>Manager</span>
      </v-toolbar-title>

      <v-fab-transition>
        <v-speed-dial v-model="fab" fab dark absolute right direction="bottom" :open-on-hover="false" transition='slide-y-reverse-transition'>
          <template v-slot:activator>
            <v-btn v-model="fab" color="pink" large dark rounded depressed>
              <span>AJOUTER<v-icon>mdi-plus</v-icon></span>
            </v-btn>
          </template>
          <v-btn dark depressed rounded color="purple" class="mr-5" :to="{name:'adduser'}" replace>
            <v-icon>mdi-plus</v-icon>Client
          </v-btn>
          <v-btn dark depressed rounded color="green" class="mr-5" :to="{name:'addticket'}" replace>
            <v-icon>mdi-plus</v-icon> Ticket
          </v-btn>
        </v-speed-dial>
      </v-fab-transition>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" class="sidebar">
      <div  v-if="technician" class="my-5 white--text font-weight-bold" style="text-align:center;border-bottom:2px solid white">
      <p >Bienvenu</p>
      <p class="text-h3"> {{technician.name}} {{technician.surname}} </p>
       </div>

      <v-list rounded>
        <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-item-action>
            <v-icon left class="white--text">{{link.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">{{link.text}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-btn depressed @click="logOut" absolute bottom class="ml-5">
        <span>Se Deconnecter</span>
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-navigation-drawer>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from 'firebase'
import db from '../firebase/api'

export default Vue.extend({
  name: 'NavBar',
  data () {
    return {
      technician: null as any,
      fab: false,
      drawer: !(this as any).isOnMobile(),
      links: [
        { icon: 'mdi-view-dashboard', text: 'Dashboard', route: '/' },
        { icon: 'mdi-account-group', text: 'Clients', route: '/users' },
        { icon: 'mdi-note-text', text: 'Tickets', route: '/tickets' },
        { icon: 'mdi-archive', text: 'Archive', route: '/archive' }
      ]
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    goHome () {
      this.$router.push({ name: 'dashboard' })
    },
    isOnMobile (): boolean {
      return /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    },
    async logOut () {
      try {
        await firebase.auth().signOut()
        this.$router.push({ name: 'login' })
      } catch (err) {
        console.log(err)
      }
    },
    async initialize () {
      const currentLogedInUserID = firebase.auth()?.currentUser?.uid
      const technicianFullName = await db.collection('technician').doc(currentLogedInUserID).get()
      this.technician = technicianFullName.data()
    }
  }
})
</script>

<style>
.toolbar-name:hover {
  cursor: pointer;
}
nav .sidebar{
    background-image: url("https://products.ls.graphics/mesh-gradients/images/08.-Violet-Blue.jpg");
      background-position: center left;
}
</style>
