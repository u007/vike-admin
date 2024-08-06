/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Site } from '@prisma/client'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { httpBatchLink, createTRPCProxyClient } from '@trpc/client'
import superjson from 'superjson'
import type { ACLUserType } from '../models/UserType'
import type { PhotoURL } from '../models/photo_url'
import { cookiesStorage } from './storage.cookie'
import { AppRouter } from '../trpc/server'
// import { dataFetchSingle, dataFetchSingleWhere } from '../realm/data/get'

export interface UserSession {
  id: string;
  email?: string;
  username?: string;
  photoURL?: PhotoURL;
  roles?: string[];
  teams?: string[];
  customData: ACLUserType | null;
  providerType: string;
  cartSessionToken?: string;
  country: string;

  site?: Site | null;
}

let accessToken = typeof window !== 'undefined' ? window.localStorage.getItem('accessToken') : ''
let refreshToken = typeof window !== 'undefined' ? window.localStorage.getItem('refreshToken') : ''

export const useAclStore = defineStore('acl', {
  state: () => ({
    loading: false,
    currentUser: {} as UserSession | null,
    loginError: '' as string,
    cartSessionToken: '' as string,
    loadIndex: 0,
  }),
  actions: {
    async login(payload: { email: string, password: string }) {
      this.loginError = ''
      this.loading = true
      try {
        const client = this.trpcClient
        const res = await client.auth.login.mutate(payload)
        this.currentUser = res.user
        this.cartSessionToken = res.cartSessionToken
        this.loading = false
        accessToken = res.accessToken
        refreshToken = res.refreshToken
        window.localStorage.setItem('accessToken', accessToken)
        window.localStorage.setItem('refreshToken', refreshToken)
      } catch (e: any) {
        this.loginError = e.message
        this.loading = false
      }
    },
    async logout() {
      console.log('logging out')
      this.loginError = ''
      this.loading = true
      try {
        console.log('logging out')
        this.loading = true
        const client = this.trpcClient()
        const res = await client.auth.logout.mutate({})
        this.currentUser = null
        this.cartSessionToken = ''
        window.localStorage.clear()
        console.log('done logout')
      } catch (e: any) {
        this.loginError = e.message
        this.loading = false
      } finally {
        this.loading = false
      }
    },
    // async refreshToken() {
    //   this.loginError = ''
    //   this.loading = true
    //   try {
    //     const client = this.trpcClient()
    //     const res = await client.mutation('refreshToken', {})
    //     this.currentUser = res.user
    //     this.cartSessionToken = res.cartSessionToken
    //     this.loading = false
    //     accessToken = res.accessToken
    //     refreshToken = res.refreshToken
    //     window.localStorage.setItem('accessToken', accessToken)
    //     window.localStorage.setItem('refreshToken', refreshToken)
    //   } catch (e: any) {
    //     this.loginError = e.message
    //     this.loading = false
    //   }
    // },
    async loadUser() {
      this.loginError = ''
      this.loading = true
      try {
        const client = this.trpcClient
        const res = await client.query('loadUser', {})
        this.currentUser = res.user
        this.cartSessionToken = res.cartSessionToken
        this.loading = false
      } catch (e: any) {
        this.loginError = e.message
        this.loading = false
      }
    },
  },
  getters: {
    trpcClient: () => {
      const createClient = () => createTRPCProxyClient<AppRouter>({
        transformer: superjson,
        links: [
          httpBatchLink({
            url: '/trpc',
            headers: async () => {
              const token = window.localStorage.getItem('accessToken') || '' 
              return {
                authorization: token ? `Bearer ${token}` : ''
              }
            },
          }),
        ],
      })
      const client = createClient()
      return client
    },
    currentDisplayName: (state: any) => {
      const data = state.currentUser?.customData
      if (state.currentUser && data) {
        if (data.firstName || data.lastName) {
          return data.firstName + (data.lastName ? ` ${data.lastName}` : '')
        }

        return state.currentUser.username
      }
      return ''
    },
    siteCurrencyLabel: () => {
      return 'USD'
    }
  },
  persist: {
    debug: true,
    storage: cookiesStorage
  }
})

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useAclStore, import.meta.hot))
// }
