import promiseRetry from 'promise-retry'

/**
 * Same as Promise.all(items.map(item => task(item))), but it waits for
 * the first {batchSize} promises to finish before starting the next batch.
 */
export const promiseAllInBatches = async (
  tasks: (Promise<any> | any)[],
  batchSize = 10,
  retryCount = 10,
) => {
  let position = 0
  let results = [] as any[]
  while (position < tasks.length) {
    const itemsForBatch = tasks.slice(position, position + batchSize).map(p =>
      promiseRetry(
        (retry: any, number: number) => {
          if (number > 1) { console.log('retrying', { number, retryCount }) }
          return p.catch((e: any) => {
            console.error('promiseAllInBatches catch', e)
            return retry(e)
          })
        },
        { retries: retryCount },
      )
        .then((r: any) => r)
        .catch((e: any) => {
          console.error('promiseAllInBatches promiseRetry-error', e)
          // return null
          throw e
        }),
    )
    const res = await Promise.all(itemsForBatch)
    // console.log(
    //   'completed batch',
    //   position + 1,
    //   tasks.length,
    //   itemsForBatch,
    //   'result',
    //   res,
    // )
    results = [...results, ...res]
    position += batchSize
  }
  // console.log('promiseAllInBatches', tasks.length, results)
  return results
}
