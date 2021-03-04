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

      <v-spacer></v-spacer>

      <v-btn depressed @click="logOut">
        <span>Se Deconnecter</span>
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>

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
    </v-navigation-drawer>
  </nav>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'NavBar',
  data () {
    return {
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
