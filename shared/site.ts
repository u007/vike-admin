// import axios from 'axios'
// import { computed, ref } from 'vue'

export const siteTeamIds = ['619f96b71b6aaa25f53fec3c']
export const siteCurrency = 'MYR'// todo fix later

// export const APIBASEURL = process?.env?.VITE_API_URL ||
//   typeof window !== 'undefined'
//   ? (window.location.protocol + '//' + window.location.host + '/api')
//   : ''

export const APIBASEURL = '/api'

export type CurrencySymbol = {
  currency: string
  abbreviation: string
  symbol: string
}

export type CurrencyConfig = {
  [currency: string]: CurrencySymbol
}

export const getFullUrl = (url = '') => {
  if (typeof window === 'undefined') return url
  const host = window.location.host
  const protocol = window.location.protocol
  return `${protocol}//${host}${url}`
}
// const cachedCurrencies = ref<CurrencyConfig>({})
// const loadedCurrency = ref(false)

// export const isVitaHealth = () => {
//   return window.location.hostname.includes('vlspa.adsperianx.com.my')
// }

// export const currencies = computed<CurrencyConfig>(() => {
//   if (!loadedCurrency.value) {
//     axios.get('/js/currency-symbols.json').then(async (resp) => {
//       console.log('cyrrency symbols', resp)
//       cachedCurrencies.value = {}

//       const res = await resp.data
//       console.log('currencies?', res)
//       res.forEach((r : any) => {
//         cachedCurrencies.value[r.abbreviation] = r
//       })
//       loadedCurrency.value = true
//     })
//   }
//   return cachedCurrencies.value
// })

export const siteIsMovingFwd = () => {
  return window.location.hostname.includes('moving.local')
}
export const siteUploadPrefix = (id?: string) => {
  if (siteIsMovingFwd()) {
    return `up/site${id ? `/${id}` : ''}`
  }
  
  return `up/site${id ? `/${id}` : ''}`
  // return 'dev/up/u'
}
