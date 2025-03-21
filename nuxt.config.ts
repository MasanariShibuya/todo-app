export default defineNuxtConfig({
  css: ["~/assets/css/tailwind.css"],
  typescript: {
    strict: false
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      // クライアント・サーバー共通の環境変数
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      }
    }
  },
  
  plugins: [
    '~/plugins/firebase.client.ts',
    '~/plugins/authState.client.ts', // ここにプラグインを追加
  ],

  build: {
    transpile: ['@vue/compiler-sfc'],
  },

  // Viteプラグインの設定をviteキー内で追加
  vite: {
    // plugins: [
    //   require('@vitejs/plugin-vue')(),
    // ],
  },

  compatibilityDate: "2025-03-03",
});
