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

    <v-navigation-drawer app v-model="drawer" class="teal">
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

<script>
import firebase from 'firebase'
export default {
  name: 'NavBar',
  data () {
    return {
      fab: false,
      drawer: true,
      links: [
        { icon: 'mdi-view-dashboard', text: 'Dashboard', route: '/' },
        { icon: 'mdi-account-group', text: 'Clients', route: '/users' },
        { icon: 'mdi-note-text', text: 'Tickets', route: '/tickets' },
        { icon: 'mdi-archive', text: 'Archive', route: '/archive' }
      ]
    }
  },
  methods: {
    goHome () {
      this.$router.push({ name: 'dashboard' })
    },
    async logOut () {
      try {
        await firebase.auth().signOut()
        this.$router.push({ name: 'login' })
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style>
.toolbar-name:hover {
  cursor: pointer;
}
</style>
