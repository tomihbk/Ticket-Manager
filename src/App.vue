<template>
  <v-app>
    <v-main class="grey lighten-5" v-if="$route.name === 'login' || $route.name === 'signup' || $route.name === '404'">
      <router-view></router-view>
    </v-main>
    <v-main class="grey lighten-5" v-else>
      <Navbar />
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Navbar from './components/NavBar.vue'

export default Vue.extend({
  name: 'App',
  components: {
    Navbar
  }
})
</script>

<style lang="scss">
v-main {
  margin: 0 !important;
  width: 100% !important;
}
</style>
