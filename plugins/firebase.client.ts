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

  // Firebase インスタンスを提供
  nuxtApp.provide('auth', auth);
  nuxtApp.provide('db', db);
});


// FirebaseサービスでTodoを追加

import { getDocs, collection, Firestore } from 'firebase/firestore';
import { useNuxtApp } from '#app';

export const getTodos = async () => {
  const { $auth, $db } = useNuxtApp();

  const auth = $auth as Auth;
  const db = $db as Firestore;

  const user = auth.currentUser;
  if (!user) {
    console.error("User is not logged in.");
    return;
  }

  try {
    // ユーザーIDを基にそのユーザーのtodosコレクションからデータを取得
    const querySnapshot = await getDocs(collection(db, `users/${user.uid}/todos`));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};



