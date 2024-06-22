import md from 'unplugin-vue-markdown/vite'
import vue from '@vitejs/plugin-vue'
import ssr from 'vike/plugin'
import vercel from 'vite-plugin-vercel'
import trpc from './trpc/vite-plugin'
import { defineConfig } from 'vite'
// import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'node:path'
// import { createPinia } from 'pinia'
// import { cjsInterop } from 'vite-plugin-cjs-interop'

const vueApp = vue({
  include: [/\.vue$/, /\.md$/],
})
// Create a custom plugin for Pinia integration
// const piniaSsrPlugin = {
//   name: 'vike-pinia-plugin',
//   configureServer(server) {
//     return () => {
//       server.middlewares.use((req, res, next) => {
//         // Create a new Pinia instance for each request
//         req.pinia = createPinia()
//         next()
//       })
//     }
//   },
// }

export default defineConfig({
  plugins: [
    // tsconfigPaths(),
    trpc(),
    vercel(),
    ssr(),
    vueApp,
    md({}),
    // piniaSsrPlugin,
    // cjsInterop({
    //   dependencies: ['vue-toast-notification'],
    // }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
  
  server: {
    port: 3805,
  },
})
