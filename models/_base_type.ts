import { type Ref, ref, type UnwrapRef, watch } from 'vue'
import type { TimeableType } from '../shared/time'

export type Nullable<T> = T | null

export type _OwnerableType = {
  createdBy?: string
  updatedBy?: string
}

export type _BaseType = _OwnerableType &
  TimeableType & {
    id?: string
    _id?: string
    _ownerId?: string

    _teams?: string[]
  }

export type Syncable = {
  sourceUpdatedAt?: Date // indicate if source latest update datetime
  lastSyncAt?: Date
  lastSyncError?: string
}

export const refDataWithArray = <T>(
  initialValue: any,
  sampleValue: any,
  watchOption = {}
): Ref<UnwrapRef<T>> => {
  const theRef = ref<T>(initialValue)
  if (sampleValue === undefined || sampleValue === null) {
    throw new Error('refData sampleValue is undefined or null')
  }

  watch(
    () => theRef.value,
    (previous: any, current: any) => {
      for (let c = 0; c < current.length; c++) {
        // console.log('checking key', c)
        for (const field in current[c]) {
          // console.log('checking field', field, typeof current[c][field], 'expected', typeof sampleValue[field])
          if (typeof sampleValue[field] === 'number') {
            if (typeof current[c][field] === 'string') {
              const value = current[c][field].trim()
              const dotPos = value.indexOf('.')
              if (
                (dotPos > -1 && dotPos === 0) ||
                dotPos === value.length - 1
              ) {
                // is starting or end dot, incomplete yet
                continue
              }
              const update = Number(current[c][field])
              if (isNaN(update)) {
                console.log('isNaN', current[c][field]) // cant fix a nan
                continue
              }

              current[c][field] = update
            } else if (typeof current[c][field] !== typeof sampleValue[field]) {
              console.log(
                'unhandled object field',
                c,
                field,
                typeof current[c][field],
                current[c][field],
                'expected type',
                typeof sampleValue[field]
              )
            }
          }
        }
      }
    },
    { deep: true, ...watchOption }
  )

  return theRef
}

/**
 * @param default vlaue
 * @param sampleValue - sample value to check type
 * @param watchOption - watch option { deep: true }
 */
export const refDataWithType = <T>(
  initialValue: any,
  sampleValue: any,
  watchOption = {}
): Ref<UnwrapRef<T>> => {
  const theRef = ref<T>(initialValue)
  if (sampleValue === undefined || sampleValue === null) {
    throw new Error('refDataWithType sampleValue is undefined or null')
  }

  watch(
    () => theRef.value,
    (previous: any, current: any) => {
      for (const field in current) {
        // type BarType = T[field as string];
        // type MyPropType = PropType<T, field>;
        // console.log(
        //   'checking',
        //   field,
        //   typeof current[field][field],
        //   'expected',
        //   typeof sampleValue[field],
        //   sampleValue
        // )
        if (typeof sampleValue[field] === 'number') {
          if (typeof current[field] === 'string') {
            const value = current[field].trim()
            const dotPos = value.indexOf('.')
            if ((dotPos > -1 && dotPos === 0) || dotPos === value.length - 1) {
              // is starting or end dot, incomplete yet
              continue
            }
            const update = Number(current[field])
            if (isNaN(update)) {
              console.log('isNaN', current[field]) // cant fix a nan
              continue
            }
            current[field] = update
          } else if (typeof current[field] !== typeof sampleValue[field]) {
            console.log(
              'unhandled object field',
              field,
              typeof current[field],
              current[field],
              'expected type',
              typeof sampleValue[field]
            )
          }
        }
      }
    },
    { deep: true, ...watchOption }
  )

  return theRef
}

export const refData = <T>(
  initialValue: any,
  watchOption = {}
): Ref<UnwrapRef<T>> => {
  const theRef = ref<T>(initialValue)
  if (initialValue === undefined || initialValue === null) {
    throw new Error('refData initialValue is undefined or null')
  }

  if (typeof initialValue === 'object') {
    if (
      !Array.isArray(initialValue) &&
      !(initialValue instanceof Date)
    ) {
      console.log('watching object', initialValue)
      watch(
        () => theRef.value,
        (previous: any, current: any) => {
          for (const key in current) {
            console.log('checking', key, typeof initialValue[key])
            if (typeof initialValue[key] === 'number') {
              if (typeof current[key] === 'string') {
                const value = current[key].trim()
                const dotPos = value.indexOf('.')
                if (
                  (dotPos > -1 && dotPos === 0) ||
                  dotPos === value.length - 1
                ) {
                  // is starting or end dot, incomplete yet
                  continue
                }
                const update = Number(current[key])
                if (isNaN(update)) {
                  console.log('isNaN', current[key]) // cant fix a nan
                  continue
                }
                current[key] = update
              } else if (typeof current[key] !== typeof initialValue[key]) {
                console.log(
                  'unhandled object field',
                  key,
                  typeof current[key],
                  current[key],
                  'expected type',
                  typeof initialValue[key]
                )
              }
            }
          }
        },
        watchOption
      )
    } else {
      console.log('not watching', initialValue)
    }
  }

  return theRef
}
