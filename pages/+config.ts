import vikeVue from "vike-vue/config";
import type { Config } from "vike/types";
import Head from "../layouts/HeadDefault.vue";
import Layout from "../layouts/LayoutDefault.vue";
import vikeVuePinia from 'vike-vue-pinia/config'
// Default config (can be overridden by pages)
export default {
  Layout,
  Head,
  // <title>
  title: "SentientAI BackOffice",
  extends: [vikeVue, vikeVuePinia],
  // passToClient: ["pinia"],
} satisfies Config;
