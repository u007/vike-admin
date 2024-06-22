import Cookies from 'js-cookie'
import cookieParser from 'cookie-parser'
import type { StorageLike } from 'pinia-plugin-persistedstate'
import { usePageContext } from 'vike-vue/usePageContext'
import { parseCookies } from '../shared/cookie'

export const cookiesStorage: StorageLike = {
  setItem (key, state) {
    console.log('cookiesStorage SET', key, state)
    return Cookies.set(key, JSON.stringify(state), { expires: 90 })
  },
  getItem (key) {
    const ctx = usePageContext()
    const cookies = ctx.headers?.cookie ? parseCookies(ctx.headers?.cookie): {}
    // console.log('pageContext', ctx.headers, cookies)
    // console.log('pageContext', cookies)
    const cookieValue = Cookies.get(key)
    const value = cookies[key]
    const res = value? JSON.parse(value) : JSON.parse(cookieValue || '{}')
    console.log('cookiesStorage GET', key, {res, value, cookieValue})
    return value? value : cookieValue || '{}'
  },
}

export const parseSavedState = <T>(name: string, defaultState: T) => {
  const savedState = cookiesStorage.getItem(name)
  console.log('parseSavedState', name, savedState)
  if (savedState) {
    const restoredState = JSON.parse(savedState)
    return { ...defaultState, ...restoredState }
  }
  return defaultState
}
