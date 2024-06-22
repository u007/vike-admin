export const pagination = {
  limit: 10,
}

function isFloat (n: number) {
  return Number(n) === n && n % 1 !== 0
}

export const matchTypeValueWithDefault = (v: any, defaultValue: NonNullable<any>) => {
  // console.log('matchTypeValueWithDefault', v, typeof v, defaultValue, typeof defaultValue)
  if (typeof v === 'undefined' || v === null) {
    return defaultValue
  }

  if (typeof defaultValue === 'number') {
    if (isFloat(defaultValue)) {
      if (isFloat(v)) {
        return v
      }
      if (typeof v === 'string') {
        return parseFloat(v)
      }
      return parseFloat(v.toString())
    }

    if (typeof v === 'number') {
      return v
    }
    
    if (typeof v === 'string') {
      return parseInt(v, 10)
    }

    return parseInt(v.toString())
  // biome-ignore lint/style/noUselessElse: <explanation>
}  else if (typeof defaultValue === 'boolean') {
    if (typeof v === 'string') {
      return v === 'true'
    }
  }
  // console.log('otherwise?', typeof v)
  return v

  // return defaultValue
}

export const cacheDuration = 60 * 10 // 10minutes

// data has to be object or array
export const parseFormForServer = (data: any) => {
  const res: any = {}
  for (const key in data) {
    if (key === '__ob__') {
      continue
    }
    const value = data[key]
    // console.log('parseFormForServer', key, value)
    if (
      value !== undefined &&
      value != null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !value._d
    ) {
      // console.log('clone object', key)
      res[key] = parseFormForServer(value)
    } else if (value?._d) {
      if (value.isValid()) {
        res[key] = value.toDate()
      } else {
        res[key] = null
      }
    } else if (Array.isArray(value)) {
      // when clone array, map does not include private or observers
      // console.log('clone array', key, value)
      res[key] = value.map((v, i) => {
        // console.log('array ', v, i)
        if (typeof v === 'object') {
          return parseFormForServer(v)
        }
        return v
        // console.log('arr value', newval)
      })
    } else if (typeof value === 'function') {
      // ignore
    } else {
      // console.log('normalclone', i, Array.isArray(val), val)
      res[key] = value
    }
  }
  return res
}

export const valueOrClone = (i: string | number, value: any) : any => {
  if (
    value != null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !value._d
  ) {
    // console.log('clone object', i, val)
    return cloneData(value)
  // biome-ignore lint/style/noUselessElse: <explanation>
}  else if (Array.isArray(value)) {
    // when clone array, map does not include private or observers
    return value.map((v, i) => {
      return valueOrClone(i, v)
    })
  // biome-ignore lint/style/noUselessElse: <explanation>
}  else if (typeof value === 'function') {
    // ignore
    return undefined
  // biome-ignore lint/style/noUselessElse: <explanation>
}  else {
    // console.log('normalclone', i, Array.isArray(val), val)
    return value
  }
}

export const formats = {
  date: 'dd MMM yyyy',
  dateTime: 'dd MMM yyyy HH:mm:ss',
}

export const dayJSFormats = {
  date: 'DD MMM YYYY',
  dateSlash: 'DD/MM/YYYY',
  dateTime: 'DD MMM YYYY HH:mm:ssZ',
  time12h: 'hh:mm A',
}

export const makeRandomAplhaNumeric = (length: number) => {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

export const makeID = (length: number) => {
  return makeRandomAplhaNumeric(length)
}

// not case sensitive and does not contain similar looking charactor like O vs 0
export const makeFriendlyRandomCaseInsentitiveAplhaNumeric = (
  length: number
) => {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

export const region = 'asia-northeast1'

export const cloneData = (obj?: any) => {
  if (typeof obj === 'undefined' || obj === null || typeof obj !== 'object') {
    return obj
  }
  const clone: any = {}
  for (const i in obj) {
    // if (typeof obj[i] !== 'function') {
    //   console.log('clone', i, obj[i], typeof obj[i])
    // }
    if (obj[i] !== null) {
      clone[i] = valueOrClone(i, obj[i])
    }
  }
  return clone
}
