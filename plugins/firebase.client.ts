import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig(); // 🔹 ここで useRuntimeConfig() を取得

  console.log('Firebase Config:', {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId,
  });
  
  const firebaseConfig = {
    apiKey: config.public.firebase.apiKey,
    authDomain: config.public.firebase.authDomain,
    projectId: config.public.firebase.projectId,
    storageBucket: config.public.firebase.storageBucket,
    messagingSenderId: config.public.firebase.messagingSenderId,
    appId: config.public.firebase.appId,
    measurementId: config.public.firebase.measurementId,
  };

  // Firebase アプリの初期化
  const firebaseApp = initializeApp(firebaseConfig);
  const auth: Auth = getAuth(firebaseApp); 
  const db = getFirestore(firebaseApp);

  // Firebase インスタンスを提供
  nuxtApp.provide('auth', auth);
  nuxtApp.provide('db', db);
});
