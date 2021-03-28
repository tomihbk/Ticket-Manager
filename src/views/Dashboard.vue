<template>
  <div class="dashboard">
    <span class="text-h2 font-weight-bold ma-5">Dashboard</span>

    <v-container class="my-5 main-container">
      <v-card class="ticket-open" max-width="200" min-width="200" v-for="(btn,index) in btnData" :key="index" :class="btn.color" :to="btn.route">
        <v-card-text class="mx-auto md-5">
          <div class="font-weight-bold">Total</div>
          <p class="text-h3 mt-3">
            {{btn.total}}<v-icon large class="ml-4" color="white">{{btn.icon}}</v-icon>
          </p>
          <p class="font-weight-medium"> {{btn.text}}</p>
        </v-card-text>
      </v-card>

    </v-container>

    <v-btn x-large depressed class="green lighten-5 ma-5" max-width="200" to="add-ticket">
      <v-icon color="black" left>mdi-file-plus</v-icon> <span class="font-weight-bold">Créer ticket</span>
    </v-btn>

    <v-btn x-large depressed class="purple lighten-5 ma-5" max-width="200" to="add-user">
      <v-icon color="black" left>mdi-account-plus</v-icon> <span class="font-weight-bold">Ajouter client</span>
    </v-btn>
  </div>
</template>

<script>
import db from '@/firebase/api'
export default {
  data () {
    return {
      btnData: [
        { icon: 'mdi-folder-open-outline', text: 'Tickets ouverts', color: 'green', total: null, route: '/tickets' },
        { icon: 'mdi-account-group', text: 'Clients', color: 'purple', total: null, route: '/users' }
      ]
    }
  },
  beforeMount () {
    this.initialize()
  },
  methods: {
    async initialize () {
      const allStatsData = await db.collection('stats').doc('stats').get()
      this.btnData[0].total = allStatsData.data()['total-opened-tickets']
      this.btnData[1].total = allStatsData.data()['total-clients']
    }
  }
}
</script>

<style>
.main-container{
    justify-content: center;
}
.ticket-open {
  margin:1.2em;
  margin-top: 2em;

}
.ticket-open div,
.ticket-open p,
.ticket-open v-icon {
  color: white;
}
.dashboard {
  text-align: center;
  margin-top: 3em;
}
.dashboard .main-container {
  display: flex;
  flex-wrap: wrap;
}
</style>
