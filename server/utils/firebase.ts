import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRuntimeConfig } from "#imports";

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

// Firebaseアプリの初期化（すでに初期化されている場合はスキップ）
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };
