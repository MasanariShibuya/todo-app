import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig(); // 🔹 ここで useRuntimeConfig() を取得

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId,
  };

  // Firebase アプリの初期化
  const firebaseApp = initializeApp(firebaseConfig);
  const auth: Auth = getAuth(firebaseApp); 
  const db = getFirestore(firebaseApp);

  // Firebase インスタンスを提供
  nuxtApp.provide('auth', auth);
  nuxtApp.provide('db', db);
});
