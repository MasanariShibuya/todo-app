<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-center text-2xl font-bold" v-if="!isSignUp">ログイン</h1>
      <h1 class="text-center text-2xl font-bold" v-if="isSignUp">サインアップ</h1>

      <!-- フォーム送信時に適切な処理を呼び出す -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Email -->
        <div>
          <input
            v-model="email"
            type="email"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            placeholder="Email"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <input
            v-model="password"
            type="password"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            placeholder="Password"
            required
          />
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            class="w-full py-3 bg-lime-500 text-white rounded-lg hover:bg-lime-600"
          >
            {{ isSignUp ? 'サインアップ' : 'ログイン' }}
          </button>
        </div>
      </form>

      <p class="text-center">
        <span v-if="!isSignUp">
          アカウントをお持ちでないですか?
          <button @click="toggleForm" class="text-lime-500">サインアップ</button>
        </span>
        <span v-if="isSignUp">
          すでにアカウントをお持ちですか?
          <button @click="toggleForm" class="text-lime-500">ログイン</button>
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const isSignUp = ref(false); // サインアップ画面かログイン画面かを切り替える
const router = useRouter();

const toggleForm = () => {
  isSignUp.value = !isSignUp.value;
};

// フォーム送信時の処理
const handleSubmit = async () => {
  console.log('フォーム送信開始');
  
  if (isSignUp.value) {
    await signup();
  } else {
    await login();
  }
};

const login = async () => {
  console.log("ログイン処理開始");
  try {
    const auth = getAuth();
    console.log("認証開始");

    console.log(auth);
    console.log(email.value);
    console.log(password.value);
    debugger;

    await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log("ログイン成功");
    router.push('/'); // ログイン後にトップページに遷移
  } catch (error: any) {
    console.error('ログインエラー:', error.code, error.message); // エラーコードも表示
    alert('ログインに失敗しました');
  }
};

const signup = async () => {
  console.log("サインアップ処理開始");
  const auth = getAuth();
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log("サインアップ成功");
    router.push('/'); // サインアップ成功後にトップページに遷移
  } catch (error) {
    console.error('サインアップエラー:', error);
    alert('サインアップに失敗しました');
  }
};
</script>

<style scoped>
/* カスタムスタイルがあれば追加 */
</style>
