<template>
  <v-app>
    <v-main class="grey lighten-5">
      <Navbar />
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '@/components/NavBar'
export default {
  name: 'App',
  components: {
    Navbar
  },
  data: () => ({
    //
  })
}
</script>
