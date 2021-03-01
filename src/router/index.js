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
import firebase from 'firebase'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      alias: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true // This component requires auth before acessing
      }
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      meta: {
        requiresAuth: true // This component requires auth before acessing
      }
    },
    {
      path: '/ticket/:id',
      name: 'ticket',
      component: Ticket,
      meta: {
        requiresAuth: true // This component requires auth before acessing
      }
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: Tickets,
      meta: {
        requiresAuth: true // This component requires auth before acessing
      }
    },
    {
      path: '/archive',
      name: 'archive',
      component: Archive,
      meta: {
        requiresAuth: true // This component requires auth before acessing
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '*',
      name: '404',
      component: PageNotFound
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    }
  ]
})

router.beforeEach((to, from, next) => {
  // check to see if route requires Auth by checking the metadata
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const currentUser = firebase.auth().currentUser // Get current user

    if (currentUser) { // Check if user is connected
      next() // if connected, user can continue to route
    } else {
      next({ name: 'login' }) // if not, user is taken to login page
    }
  } else {
    next()// if route doesn't requires Auth, continue navigation
  }
})

export default router
