import { defineStore, acceptHMRUpdate } from 'pinia'
import { cookiesStorage, parseSavedState } from './storage.cookie'

const storeName = 'alertStore'
export const useAlertStore = defineStore(storeName, {
  state: () => parseSavedState(storeName, {
      loading: false,
      success: '',
      error: '',
      link: '',
      linkLabel: ''
  }),
  getters: {
    // doubleCount: (state) => state.count * 2,
  },
  actions: {
    setLink (link: string, linkLabel: string) {
      this.link = link
      this.linkLabel = linkLabel
    },
    setSuccess (msg: string) {
      this.success = msg
      this.error = ''
    },
    setError (msg: string) {
      this.error = msg
      this.success = ''
    },
    clearSuccess () {
      this.success = ''
    },
    clearError () {
      this.error = ''
      this.link = ''
      this.linkLabel = ''
    },
    clear () {
      this.error = ''
      this.link = ''
      this.linkLabel = ''
      this.success = ''
    },
  },
  persist: {
    debug: true,
    storage: persistedState.sessionStorage
  }
})

// if (import.meta.hot) { import.meta.hot.accept(acceptHMRUpdate(useAlertStore, import.meta.hot)) }
