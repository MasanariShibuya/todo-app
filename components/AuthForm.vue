<!-- components/AuthForm.vue -->
<template>
    <div class="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 class="text-xl font-bold text-center mb-4">User Authentication</h2>
  
      <!-- Sign Up Form -->
      <form @submit.prevent="signUp" class="mb-4">
        <input v-model="email" type="email" placeholder="Email" class="w-full p-2 border rounded mb-2" />
        <input v-model="password" type="password" placeholder="Password" class="w-full p-2 border rounded mb-2" />
        <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded">Sign Up</button>
      </form>
  
      <!-- Sign In Form -->
      <form @submit.prevent="signIn">
        <input v-model="email" type="email" placeholder="Email" class="w-full p-2 border rounded mb-2" />
        <input v-model="password" type="password" placeholder="Password" class="w-full p-2 border rounded mb-2" />
        <button type="submit" class="w-full p-2 bg-green-500 text-white rounded">Sign In</button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import type { Auth } from 'firebase/auth'; 

const email = ref('');
const password = ref('');
const { $auth } = useNuxtApp(); // $auth を取得

// 🔽 $auth が undefined でないか確認
const auth = $auth as Auth;

const signUp = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log('User signed up:', userCredential.user);
  } catch (error) {
    console.error('Error signing up:', error);
  }
};

const signIn = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log('User signed in:', userCredential.user);
  } catch (error) {
    console.error('Error signing in:', error);
  }
};

// 🔽 auth が初期化されているか確認し、onAuthStateChanged を設定
onMounted(() => {
  if (auth) {
    // Auth が正しく初期化されてから onAuthStateChanged を設定
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
</script>
