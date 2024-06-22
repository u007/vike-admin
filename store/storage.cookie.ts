import Cookies from 'js-cookie'
import type { StorageLike } from 'pinia-plugin-persistedstate'

export const cookiesStorage: StorageLike = {
  setItem (key, state) {
    console.log('cookiesStorage SET', key, state)
    return Cookies.set(key, JSON.stringify(state), { expires: 90 })
  },
  getItem (key) {
    const value = Cookies.get(key)
    const res = value? JSON.parse(value) : null
    console.log('cookiesStorage GET', key, value, res)
    return res
  },
}

