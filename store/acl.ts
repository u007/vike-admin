/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Site } from '@prisma/client'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { httpBatchLink, createTRPCProxyClient } from '@trpc/client'
import superjson from 'superjson'
import type { ACLUserType } from '../models/UserType'
import type { AppRouter } from '../server/trpc/routers'
import type { PhotoURL } from '../models/photo_url'
// import { dataFetchSingle, dataFetchSingleWhere } from '../realm/data/get'

export interface UserSession {
  id: string;
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
    currentUser: {} as UserSession,
    loginError: '' as string,
    cartSessionToken: '' as string,
    loadIndex: 0,
  }),
  getters: {
    isAuthenticated: () => {
      return !!accessToken && !!currentUser.id
    },
    trpcClient: () => {
      const createClient = () => createTRPCProxyClient<AppRouter>({
        transformer: superjson,
        links: [
          httpBatchLink({
            url: '/api/trpc',
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
})

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useAclStore, import.meta.hot))
// }
