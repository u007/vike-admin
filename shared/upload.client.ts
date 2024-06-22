// import * as mime from 'mime/lite'
import { readAndCompressImage } from 'browser-image-resizer'
// import { PhotoURL } from '@prisma/client'
import * as mime from 'mime'
import { siteUploadPrefix } from './site'
import type { PhotoURL } from '@/models/photo_url'
// import { storageDeleteAll } from '~/shared/image'
// import { parseCleanFilename } from '~/shared/firebase'
// import { isImage, thumbSizes } from '~/shared/im'

export const s3BaseURL = computed(() => {
  return useNuxtApp().$config.S3_ENDPOINT
})

// const picaF = pica()
interface UploadParam {
  field: string
  name: string
  file: File
  mimeType?: string
}

interface UploadResult {
  path: string
  url: PhotoURL
}

// export const saveUpload = async <T extends Record<string, any>>(
//   rootState: RootStateType,
//   model: BaseModel,
//   data: T,
//   id: string,
//   upload: UploadParam
// ): Promise<{ record: T; path: string; url: PhotoURL }> => {
//   if (id === undefined || id === null || id === '') {
//     throw new Error(`Invalid ${model.label || model.table} id`)
//   }
//   const res = await uploadAndGenerateThumb(model, data, id, upload)
//   console.log('upload and generated thumb', upload, res)
//   const saveRes = await dataSaveSingle<T>(rootState, model, {
//     ...data,
//     [upload.field]: res.path,
//     [upload.field + 'URL']: res.url,
//   })

//   console.log('saveUpload', saveRes)

//   if (saveRes === null) {
//     throw new Error('upload failed')
//   }

//   return {
//     record: saveRes,
//     path: res.path,
//     url: res.url,
//   }
// }

export const getImageThumbs = (
  id: string,
  filePath: string,
  urls: PhotoURL, // existing urls
  path: string,
  field: string,
  sizes: number[] = thumbSizes
): PhotoURL => {
  if (!id) {
    throw new Error('getImageThumbs invalid id')
  }
  if (!filePath) {
    throw new Error('image missing')
  }

  if (urls) {
    const pendingSizes = sizes.filter(s => !urls[`t${s}` as keyof PhotoURL])
    console.log('pendingSizes', pendingSizes)
    if (pendingSizes.length < 1) {
      // console.log('loadImageWithCache skipping', field)
      return urls
    }
  }

  console.log('getImageThumbs', id, path, field, filePath)
  const imageURLs : PhotoURL = { original: '', t128: null, t256: null, t512: null, t1024: null, t2048: null }

  // const loads: Promise<any>[] = []
  const dirPath = filePath.substring(0, filePath.lastIndexOf('/'))
  const fileName = filePath.split(/(\\|\/)/g).pop()
  // if (!urls || !urls.original) {
  //   console.log('getImageThumbs', id, 'loading original')
  //   loads.push(
  //     loadImageURLOrEmpty(filePath)
  //       .then((url) => (imageURLs.original = url))
  //       .catch((e) => {
  //         console.error('getImageThumbs failed', 'original', e)
  //       })
  //   )
  // }
  imageURLs.original = filePath
  for (let c = 0; c < sizes.length; c++) {
    const thumbName = `t${sizes[c]}`
    imageURLs[(`t${sizes[c]}`) as keyof PhotoURL] = `${dirPath}/thumb@${sizes[c]}_${fileName}`
  } // each sizes
  // await Promise.all(loads)
  console.log('getImageThumbs imageURLS', imageURLs)

  return imageURLs
}

// export const uploadAndGenerateThumb = async (
//   model: BaseModel,
//   data: Record<string, any>,
//   id: string,
//   upload: UploadParam
// ): Promise<{ path: string; url: PhotoURL }> => {
//   if (!model.table) {
//     throw new Error('Model table missing')
//   }
//   const prefix = model.table + '/' + id + '/' + upload.field
//   const uploadRes = await uploadModelFile(prefix, id, upload)
//   console.log('uploadRes', uploadRes)
//   data[upload.field] = uploadRes.path
//   data[upload.field + 'URL'] = uploadRes.thumbs
//   // await sleep(5000)
//   // const urls = await getImageThumbs(
//   //   id,
//   //   data[upload.field],
//   //   data[upload.field + 'URL'],
//   //   model.table + '/' + id + '/' + upload.field,
//   //   upload.field
//   // )
//   return { path: uploadRes.path, url: uploadRes.thumbs }
// }

export type UploadFileResult = {
  name: string
  path: string
  mimeType: string
  thumbs: PhotoURL
}

// const $trpcClient: inferRouterProxyClient<AppRouter> = useNuxtApp().$trpcClient
// console.log('useNuxtApp()', useNuxtApp(), useNuxtApp().$trpcClient, $trpcClient)
export const uploadFile = async (
  repoId: string,
  userId: string,
  fullPath: string,
  p: UploadParam,
  withThumbnail = true,
  isThumbnail = false, // whether this is a thumbnail, if true then use fullpath as destpath
  aceessType = 'public-read'
): Promise<UploadFileResult> => {
  console.log('uploadFile', { userId, fullPath, p })
  if (!p.name) {
    throw new Error('uploadFile missing name')
  }
  const file = p.file
  const fileName = parseCleanFilename(p.name)
  const dirPath = fullPath.substring(0, fullPath.lastIndexOf('/'))
  const destPath = isThumbnail ? fullPath : `${dirPath}/${fileName}`
  const mimeType = p.mimeType ? p.mimeType : mime.getType(fileName) || ''
  console.log('uploadFile', { dirPath, destPath, fullPath })
  // const s3Signed: any = await callFunc('s3Upload', destPath, mimeType)
  const param = {
    path: destPath,
    _ownerId: userId,
    contentType: mimeType,
    repoId,
  }

  console.log('signing s3', { fullPath, param })
  const { url, publicUrl, path } = await useNuxtApp().$trpcClient.crud.s3.upload.mutate(param)
  // const s3Signed: any = await axios.post(
  //   `${APIBASEURL}/v1/s3/upload`,
  //   param,
  // )
  if (!url) {
    throw new Error('signed url failed')
  }
  // await storageDeleteAll(pathPrefix + '/' + id, []).catch((err) => {
  //   console.error('deleteall failed', err)
  //   throw err
  // })

  const myHeaders = new Headers({
    'Content-Type': mimeType,
    'x-amz-acl': aceessType,
  })
  console.log('sending to signed', url)
  const response = await fetch(url, {
    method: 'PUT',
    headers: myHeaders,
    body: file,
  })
  const actualPath = path.replaceAll('//', '/')
  console.log('uploadFile uploaded', { destPath, actualPath, url })
  const thumbs = {} as PhotoURL
  thumbs.original = (`${publicUrl}/${actualPath}`)
  // thumbs.original = destPath.replaceAll('//', '/')

  if (withThumbnail && isImage(mimeType)) {
    const imgSize = await getFileImageSize(file)
    console.log('uploadFile imgsize', imgSize)
    const calls = [] as Promise<any>[]

    for (let c = 0; c < thumbSizes.length; c++) {
      const thumbsize = thumbSizes[c]
      const offScreenCanvas = document.createElement('canvas')

      const ratio = thumbsize / imgSize.width
      offScreenCanvas.width = imgSize.width * ratio
      offScreenCanvas.height = imgSize.height * ratio
      console.log(
        'uploadFile resize',
        ratio,
        offScreenCanvas.width,
        offScreenCanvas.height
      )

      const thumbPath = `${dirPath}/thumb@${thumbSizes[c]}_${fileName}`

      calls.push(
        new Promise((resolve, reject) => {
          readAndCompressImage(file, {
            quality: 0.9,
            maxWidth: offScreenCanvas.width,
            maxHeight: offScreenCanvas.height,
            mimeType,
          }).then(async (compressedFile) => {
            console.log('RESIZED!', compressedFile)
            const thumbRes = await uploadFile(
              repoId,
              userId,
              thumbPath,
              {
                field: p.field,
                name: p.name,
                file: compressedFile as File,
                mimeType: p.mimeType,
              },
              false, true
            )

            // thumbs['t' + thumbsize as keyof PhotoURL] = useNuxtApp().$config.S3_ENDPOINT + '/' + thumbRes.path
            thumbs[`t${thumbsize}` as keyof PhotoURL] = (`${publicUrl}/${thumbRes.path}`)

            resolve(null)
          }).catch((err) => {
            console.error('uploadFile resize failed', err)
            throw err
          })

          // picaF
          //   .resize(imgSize.img, offScreenCanvas, {
          //     width: imgSize.width,
          //     height: imgSize.height,
          //     toWidth: offScreenCanvas.width,
          //     toHeight: offScreenCanvas.height,
          //   })
          //   .then((result) => {
          //     console.log('RESIZED!', result)
          //     return picaF.toBlob(result, mimeType, 0.9)
          //   })
          //   .then(async (blob) => {
          //     console.log('uploadFile blob done: ', blob)
          //     const thumbRes = await uploadFile(
          //       userId,
          //       thumbPath,
          //       {
          //         field: p.field,
          //         name: p.name,
          //         file: blob,
          //         mimeType: p.mimeType,
          //       },
          //       false, true
          //     )

          //     thumbs['t' + thumbsize] = s3BaseURL + '/' + thumbRes.path

          //     resolve(null)
          //   })
          // .catch((err) => {
          //   console.error('uploadFile resize failed', err)
          //   throw err
          // })
          // console.log('uploadfile thumb', thumbsize, thumbPath, thumbFile)
          // const thumbRes = await uploadFile(thumbPath, id, p, false)
        })
      ) // calls
    } // thmbs

    await Promise.all(calls)
  }

  console.log('uploaded', thumbs, response)

  return { name: fileName, path: actualPath, thumbs, mimeType }
}

// export const uploadModelFile = async (
//   pathPrefix: string,
//   id: string,
//   p: UploadParam,
//   withThumbnail = true
// ): Promise<{ path: string; thumbs: PhotoURL }> => {
//   console.log('uploaded product image', p)
//   const file = p.file
//   const fileName = parseCleanFilename(p.name)
//   console.log('uploadModelFile fileName', fileName)
//   const uploadPath = pathPrefix + '/' + fileName
//   const pathUserPath = 'up/u/' + realm.currentUser.id
//   const fullPath = pathUserPath + '/' + uploadPath

//   return uploadFile(realm.currentUser.id, fullPath, p, withThumbnail)
// }

/**
  get image size with Image element
 */
export const getFileImageSize = (
  file: File
): Promise<{ width: number; height: number; img: HTMLImageElement }> => {
  const _URL = window.URL || window.webkitURL
  const img = new Image()
  const objectUrl = _URL.createObjectURL(file)
  return new Promise((resolve, reject) => {
    img.onload = () => {
      console.log(`${img.width} ${img.height}`)
      resolve({ width: img.width, height: img.height, img })
      _URL.revokeObjectURL(objectUrl)
    }
    img.onerror = (err) => {
      console.error('img size failed', err)
      reject(new Error(`unknown error ${err}`))
    }
    img.src = objectUrl
  })
}

export const userUploadFile = (
  userId: string,
  fullPath: string,
  p: UploadParam,
  withThumbnail = true,
): Promise<UploadFileResult> => {
  const tPath = `${siteUploadPrefix()}/${userId}/${fullPath}`
  return uploadFile(userId, tPath, p, withThumbnail)
}

export const storageDeletePhoto = async (
  path: string,
  field: string,
  imageURLs: any,
  fileName: string
): Promise<any> => {
  // TODO
}
