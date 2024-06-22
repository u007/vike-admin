// import { parseISO } from "date-fns"

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const debugTime = async <T>(fn: (token?: string) => Promise<T> | T, name = 'debugTime', offDebug = false) => {
  const start = Date.now()
  // random token to avoid caching
  const token = Math.random().toString(36).substring(7)
  const res = await fn(`${name}-${token}`)
  if (offDebug) return res
  console.log(name, 'took', Date.now() - start, 'ms')
  return res
}

export const delayedSingleExecution = (fn: () => void, delay = 1000) => {
  let timeout: NodeJS.Timeout | null = null
  return () => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(fn, delay)
  }
}

export type TimeableType = {
  createdAt?: Date | null
  updatedAt?: Date | null
}
