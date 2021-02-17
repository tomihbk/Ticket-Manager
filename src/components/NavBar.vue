<template>
  <nav>
    <v-toolbar flat app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase">
        <span class="font-weight-light">
          Ticket
        </span>
        <span>Manager</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn depressed>
        <span>Sign Out</span>
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>

    </v-toolbar>

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
export default {
  name: 'NavBar',
  data () {
    return {
      drawer: false,
      links:[
          {icon:'mdi-view-dashboard',text:'Dashboard',route:'/'},
          {icon:'mdi-account-group',text:'Clients',route:'/users'},
          {icon:'mdi-note-text',text:'Tickets',route:'/tickets'},
          {icon:'mdi-archive',text:'Archive',route:'/archive'}
      ]
    }
  }
}
</script>

<style>
</style>
