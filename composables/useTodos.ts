// composables/useTodos.ts
import { getDocs, collection, Firestore } from 'firebase/firestore';
import { useNuxtApp } from '#app';
import type { Auth } from 'firebase/auth';

export const useTodos = () => {
  const { $auth, $db } = useNuxtApp();
  const auth = $auth as Auth;
  const db = $db as Firestore;

  const getTodos = async () => {
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

  return { getTodos };
};
