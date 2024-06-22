import axios, { type AxiosResponse } from 'axios'
import { stringify } from 'qs'
import type { UserSession } from '../store/acl'
import { APIBASEURL } from './site'
// import { ApiBaseUrl } from '@/shared/site'

export type UserStateType = {
  accessToken: string | null
}

export const defaultPageSize = 10

export const axiosPut = <T>(
  currentUser: UserSession | null,
  url: string,
  data: Record<string, any>,
  options: Record<string, any> = {},
  authentication = true,
) => {
  return fetchAxios<T>(
    currentUser,
    { method: 'put', url, data, ...options },
    authentication,
  )
}

export const axiosPatch = <T>(
  currentUser: UserSession | null,
  url: string,
  data: Record<string, any>,
  options: Record<string, any> = {},
  authentication = true,
) => {
  return fetchAxios<T>(
    currentUser,
    { method: 'patch', url, data, ...options },
    authentication,
  )
}

export const axiosPost = <T>(
  currentUser: UserSession | null,
  url: string,
  data: Record<string, any> | FormData,
  options: Record<string, any> = {},
  authentication = true,
) => {
  return fetchAxios<T>(
    currentUser,
    { method: 'post', url, data, ...options },
    authentication,
  )
}

export const axiosGet = <T>(
  currentUser: UserSession | null,
  url: string,
  options: Record<string, any> = {},
  authentication = true,
) => {
  // console.log('axiosGet', url, options)
  return fetchAxios<T>(
    currentUser,
    { method: 'get', url, ...options },
    authentication,
  )
}

export const axiosDelete = <T>(
  currentUser: UserSession | null,
  url: string,
  options: Record<string, any> = {},
  authentication = true,
) => {
  return fetchAxios<T>(
    currentUser,
    { method: 'delete', url, ...options },
    authentication,
  )
}

export const fetchAxios = async <T>(
  currentUser: UserSession | null,
  options: Record<string, any>,
  authentication = true,
) => {
  const $acl = useAclStore()
  // console.log('fetchAxios2222', {...options})
  let { url, maxAttempt } = options
  const { params, method } = options
  if (
    typeof maxAttempt === 'undefined' &&
    (!method || method.toLowerCase() === 'get')
  ) {
    maxAttempt = 3
  } else {
    maxAttempt = 1 // do not retry for anything not GET
  }
  let attempt = 0
  let isOwnApiURL = url.startsWith(`${APIBASEURL}/`) || url === APIBASEURL
  if (!isOwnApiURL && !url.startsWith('http:') && !url.startsWith('https:')) {
    if (url.startsWith('/')) {
      // console.log('import.meta.env', import.meta.env)
      url = `${APIBASEURL}${url}`
      isOwnApiURL = true
    }
  }
  const token = await $acl.getAccessToken()
  // console.log('fetchAxios', { token, authentication, isOwnApiURL })
  if (isOwnApiURL && authentication && !token) {
    console.error('token missing?', currentUser)
    throw new Error('Token not set yet')
  }
  const auth = `Bearer ${token}`
  const qsStr =
    (!method || method.toLowerCase() === 'get') && params
      ? stringify(params)
      : ''
  // console.log('method', method, 'params', params)
  if (qsStr) {
    url = url.includes('?') ? `${url}&${qsStr}` : `${url}?${qsStr}`
    // biome-ignore lint/performance/noDelete: <explanation>
    delete options.params
  }
  // console.log('fetchAxios attempt', { url, method, params, auth }, options)
  // console.log('axios.onRequest', auth, options.method, options.url)
  // console.log('axios.onRequest', options.method, options.url)
  const p =
    isOwnApiURL && authentication
      ? {
          ...options,
          headers: { Authorization: auth, ...options.headers },
          url,
        }
      : { ...options, url }
  // console.log('fetch', p.url, p)

  return axios(p)
    .then((r: AxiosResponse<T>) => r.data)
    .catch((err: any) => {
      console.log('fetchAxios error', maxAttempt, method, url, err)
      if (attempt + 1 < maxAttempt) {
        attempt += 1
        console.log(
          'fetchAxios reattempt',
          url,
          attempt,
          maxAttempt,
          // options,
          err,
        )
        return fetchAxios<T>(
          currentUser,
          { ...options, url, maxAttempt: maxAttempt - 1 },
          authentication,
        )
      }

      const { response } = err
      if (response?.data?.message) {
        if (Array.isArray(response.data.message)) {
          throw new TypeError(response.data.message.join(', '))
        }
        if (typeof response.data.message === 'string') {
          throw new TypeError(response.data.message)
        }
        throw new Error(JSON.stringify(response.data.message))
      }

      if (response.data?.error) {
        throw new Error(response.data.error)
      }
      throw err
    }) as T
}
