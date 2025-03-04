// plugins/authState.client.ts
import { defineNuxtPlugin } from '#app';
import { onAuthStateChanged, type Auth } from 'firebase/auth';
import { useAuthUser } from '~/composables/useAuthuser';
import { useRouter } from 'vue-router';

export default defineNuxtPlugin((nuxtApp) => {
  const auth = nuxtApp.$auth as Auth; // Firebase Auth インスタンスを取得
  const authUser = useAuthUser();
  const router = useRouter();

  if (!auth) {
    console.error('Firebase Auth is not available.');
    return;
  }

  // Firebase Authの状態変更を監視
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authUser.value = {
        uid: user.uid,
        email: user.email || '',
      };
    } else {
      authUser.value = null;
      router.push('/login'); // 未ログイン時にログインページへリダイレクト
    }
  });
});
