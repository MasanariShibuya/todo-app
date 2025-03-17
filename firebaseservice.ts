
// services/firebaseService.ts (または任意のファイル)

import { getDocs, collection, Firestore } from 'firebase/firestore';
import { useNuxtApp } from '#app';
import { type　Auth } from 'firebase/auth';

export const getTodos = async () => {
  const { $auth, $db } = useNuxtApp();

  // 型キャストで型を確認
  const auth = $auth as Auth;
  const db = $db as Firestore;

  // 現在ログインしているユーザーの確認
  const user = auth.currentUser;
  if (!user) {
    console.error("User is not logged in.");
    return;
  }

  try {
    // ユーザーIDを基にそのユーザーのtodosコレクションからデータを取得
    const querySnapshot = await getDocs(collection(db, `users/${user.uid}/todos`));

    // 取得したデータを処理
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};
