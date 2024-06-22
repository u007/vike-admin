/* eslint-disable no-control-regex */
// import { encode } from '~/utils/firebase-key-encode'
// const { initializeAppCheck, ReCaptchaV3Provider } = require("firebase/app-check");
// import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// import * as truncate from 'truncate-utf8-bytes'
const illegalRe = /[/?<>\\:*|"]/g
// eslint-disable-next-line prefer-regex-literals
// biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
const  controlRe = /[\x00-\x1F\x80-\x9F]/g
const reservedRe = /^\.+$/
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i
const windowsTrailingRe = /[. ]+$/

function sanitize (input: string, replacement: string) {
  if (typeof input !== 'string') {
    console.log('input', input)
    throw new TypeError('Sanitize Input must be string')
  }
  const sanitized = input
    ?.replace(illegalRe, replacement)
    ?.replace(controlRe, replacement)
    ?.replace(reservedRe, replacement)
    ?.replace(windowsReservedRe, replacement)
    ?.replace(windowsTrailingRe, replacement)
  // return truncate(sanitized, 255)
  return sanitized.trim()
}

// %2E
export const parseCleanFilename = (input: string, options: any = {}) => {
  const replacement = (options?.replacement) || ''
  const output = sanitize(input, replacement)
    .split(' ')
    .join('_')
    .split('%')
    .join('')
  if (replacement === '') {
    return output
  }
  return sanitize(output, '')
}
