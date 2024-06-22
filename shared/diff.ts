import { transform, isEqual, isObject, isArray } from 'lodash-es'

const changes = (object: any, base: any) => {
  let arrayIndexCounter = 0
  return transform(object, (result: any, value, key) => {
    // console.log('comparing', key, value, base[key])
    if (!isEqual(value, base[key])) {
      const resultKey = isArray(base) ? arrayIndexCounter++ : key

      result[resultKey] =
        isObject(value) && isObject(base[key])
          ? changes(value, base[key])
          : value
      // console.log('Result: ' + JSON.stringify(result))
    }
  })
}

export const deepDifferences = (
  object: Record<string, any>,
  base: Record<string, any>
): Record<string, any> => {
  return changes(object, base)
}

// compare between object only
export const differences = <T>(
  object: Record<string, any>,
  base: Record<string, any>
): T => {
  const res = {} as T
  for (const key in object) {
    // console.log('diff', key, object[key], base[key])
    if (object[key] !== base[key]) {
      res[key] = object[key]
    }
  }
  return res
}
