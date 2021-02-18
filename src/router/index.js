import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Archive from '@/views/Archive.vue'
import Login from '@/views/auth/Login.vue'
import SignUp from '@/views/auth/SignUp.vue'
import Ticket from '@/views/Ticket.vue'
import Tickets from '@/views/Tickets.vue'
import Users from '@/views/Users.vue'
import PageNotFound from '@/views/PageNotFound.vue'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/ticket/:id',
      name: 'ticket',
      component: Ticket
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: Tickets
    },
    {
      path: '/archive',
      name: 'archive',
      component: Archive
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    { path: '*', component: PageNotFound },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    }
  ]
})
