import type { PhotoURL } from '~/models/photo_url'

export const thumbSizes: number[] = [128, 256, 512, 1024, 2048]

export type GalleryImage = {
  path: string
  name: string // To identify /banners/[id]/fileName
  mimeType: string
  s3RepoId?: string | null
  urls?: PhotoURL | null
  status?: boolean
}
interface MediumType {
  mimeType: string
  urls?: PhotoURL
}

export const noImageSrc = '/img/no-img.jpeg'

export const mediumFirstSrcset = (
  mediums: MediumType[] | undefined | null,
  sizes?: number[],
  noImage?: string
): string => {
  if (typeof mediums === 'undefined' || mediums === null) {
    return noImage || noImageSrc
  }

  const first = mediums.find(m => isImage(m.mimeType) && m.urls)
  if (first) {
    return imageSrcset(first.urls as PhotoURL, sizes)
  }
  return noImage || noImageSrc
}

/**
 * get srcsets - if no sizes found, return original src
 * @param urls
 * @param sizes array width sizes
 */
export const imageSrcset = (urls: PhotoURL, sizes?: number[]): string => {
  if (!urls) {
    return noImageSrc
  }
  const genSizes = sizes || thumbSizes
  const foundURLS = genSizes.filter(s => urls[`t${s}` as keyof PhotoURL])
  if (foundURLS.length < 1) {
    return urls.original as string
  }

  return foundURLS
    .map((s) => {
      return `${urls[`t${s}` as keyof PhotoURL]} ${s}w`
    })
    .join(', ')
}

export const galleryMimeTypes = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4',
]

export const imageMimeTypes = [
  'image/webp',
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/pipeg', 'image/tiff'
]

export const imageExtensions = [
  '.webp',
  '.jpeg', '.jpg', '.png', '.gif', '.pipeg', '.tiff'
]

export const extToMimeType: Record<string, string> = {
  '.webp': 'image/webp',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.pipeg': 'image/pipeg',
  '.tiff': 'image/tiff',
}

export const videoMimeTypes = [
  'video/x-flv',
  'video/mp4',
  'application/x-mpegURL',
  'video/MP2T',
  'video/3gpp',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-ms-wmv',
]

export const getImageMimeType = (
  fileName: string,
  defaultMime = 'image/jpeg'
): string | null => {
  const ext = fileName.split('.').pop()?.toLocaleLowerCase()

  if (ext) {
    return extToMimeType[`.${ext}`] || defaultMime
  }
  return null
}

export const isImage = (mimeType: string, filePath?: string): boolean => {
  if (mimeType) {
    return imageMimeTypes.includes(mimeType)
  }
  for (let c = 0; c < imageExtensions.length; c++) {
    if (filePath?.endsWith(imageExtensions[c])) {
      return true
    }
  }
  return false
}

export const isVideo = (mimeType: string, path?: string): boolean => {
  return videoMimeTypes.includes(mimeType)
}
