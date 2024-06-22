import { useRoute } from 'vue-router'

export const getModuleParentPath = (path: string): string => {
  console.log('currenturl', path)
  const paths = path.split('/')

  if (paths.length < 3) {
    return paths.join('/')// return same url
  }

  return paths.slice(0, paths.length - 1).join('/')
}

export const getBaseURL = () => {
  return window.location.origin
}

export const getParamURL = (path: number) => {
  return useRoute().path.split('/')[path]
}
