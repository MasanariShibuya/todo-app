// /plugins/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig();

const firebaseConfig = {
    apiKey: "AIzaSyDR27ahtVkjTg34enwbS5OhGn4JjBlpV0w",
    authDomain: "todo-29e28.firebaseapp.com",
    projectId: "todo-29e28",
    storageBucket: "todo-29e28.firebasestorage.app",
    messagingSenderId: "130022575123",
    appId: "1:130022575123:web:ddab148e839d02487a03e6",
    measurementId: "G-WG326WXVF2"
  };
  
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp); // ✅ `db` をエクスポート
