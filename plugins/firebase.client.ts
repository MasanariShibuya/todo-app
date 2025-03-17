// plugins/firebase.client.ts

import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  
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

  console.log('Firebase initialized successfully')
  
  //ksksksks
  // Firebase インスタンスを提供
  nuxtApp.provide('auth', auth);
  nuxtApp.provide('db', db);
});





