// https://vike.dev/onCreateApp
export { onCreateApp }

import type { OnCreateAppSync } from 'vike-vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const onCreateApp: OnCreateAppSync = (pageContext): ReturnType<OnCreateAppSync> => {
  const { app } = pageContext
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  app.use(pinia)
  // console.log(`Vue version: ${app.version}`)
}