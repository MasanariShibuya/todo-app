import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig(); // 🔹 ここで useRuntimeConfig() を取得
  
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

// plugins/firebase.clients.ts の下に追加
import { addDoc, collection } from "firebase/firestore";
import { useNuxtApp } from '#app';

export const addTodo = async (todoText: string) => {
  const { $auth, $db } = useNuxtApp();  // プラグインで提供されたauthとdbを取得

  const user = auth.currentUser; // 現在のログインユーザーを取得
  if (!user) {
    console.error("User is not logged in.");
    return;
  }

  try {
    await addDoc(collection(db, `users/${user.uid}/todos`), {
      text: todoText,
      createdAt: new Date(),
    });
    console.log("Todo added successfully!");
  } catch (error) {
    console.error("Error adding todo:", error);
  }
};
