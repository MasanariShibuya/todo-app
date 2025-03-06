<template>
  <div class="max-w-md mx-auto p-4 bg-white shadow-md rounded">
    <h2 class="text-xl font-bold text-center mb-4">User Authentication</h2>

    <!-- Sign Up Form -->
    <form @submit.prevent="signUp" class="mb-4">
      <input v-model="signUpEmail" type="email" placeholder="Email" class="w-full p-2 border rounded mb-2" />
      <input v-model="signUpPassword" type="password" placeholder="Password" class="w-full p-2 border rounded mb-2" />
      <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded">Sign Up</button>
    </form>

    <!-- Sign In Form -->
    <form @submit.prevent="signIn">
      <input v-model="signInEmail" type="email" placeholder="Email" class="w-full p-2 border rounded mb-2" />
      <input v-model="signInPassword" type="password" placeholder="Password" class="w-full p-2 border rounded mb-2" />
      <button type="submit" class="w-full p-2 bg-green-500 text-white rounded">Sign In</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import type { Auth } from 'firebase/auth'; 

// サインアップ用のデータ
const signUpEmail = ref('');
const signUpPassword = ref('');

// サインイン用のデータ
const signInEmail = ref('');
const signInPassword = ref('');

const { $auth } = useNuxtApp();
const auth = $auth as Auth;

const signUp = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail.value, signUpPassword.value);
    console.log('User signed up:', userCredential.user);
  } catch (error) {
    console.error('Error signing up:', error);
  }
};

const signIn = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, signInEmail.value, signInPassword.value);
    console.log('User signed in:', userCredential.user);
  } catch (error: any) {
    console.error('Error signing in:', error.message);
    if (error.code === 'auth/user-not-found') {
      console.log('User not found, please sign up first.');
    }
  }
};

onMounted(() => {
  if (auth) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User logged in:', user.email);
      } else {
        console.log('No user logged in');
      }
    });
  } else {
    console.error('Auth is not initialized');
  }
});

import { addTodo } from "../plugins/firebase.client";  // 上記で定義したaddTodoをインポート

const todoText = ref("");

const handleAddTodo = () => {
  if (todoText.value.trim()) {
    addTodo(todoText.value);  // Todoを追加
    todoText.value = "";  // フォームをクリア
  }
};
</script>
