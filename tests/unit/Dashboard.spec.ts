import Dashboard from '@/views/Dashboard.vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Dashboard', () => {
  const localVue = createLocalVue()
  let vuetify:Vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('should check opened ticket and saved client', () => {
    const wrapper = mount(Dashboard, { localVue, vuetify, stubs: ['router-link', 'router-view'] })

    expect(wrapper.text()).toContain('Tickets ouvert')
  })
})
