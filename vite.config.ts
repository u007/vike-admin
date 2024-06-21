import md from "unplugin-vue-markdown/vite";
import vue from "@vitejs/plugin-vue";
import ssr from "vike/plugin";
import vercel from "vite-plugin-vercel";
import trpc from "./trpc/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [trpc(), vercel(), ssr(), vue({
    include: [/\.vue$/, /\.md$/],
  }), md({})],
  server: {
    port: 3805,
  }
});