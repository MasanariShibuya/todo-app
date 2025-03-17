<template>
  <div class="max-w-md mx-auto p-4 bg-white shadow-md rounded">
    <h2 class="text-xl font-bold text-center mb-4">User Authentication</h2>

    <!-- Error message -->
    <div v-if="errorMessage" class="text-red-500 mb-4">
      {{ errorMessage }}
    </div>

    <!-- サインインとサインアップの切り替え -->
    <div class="flex justify-center space-x-4 mb-4">
      <button @click="isSignUp = true" :class="{'bg-blue-500': isSignUp, 'bg-gray-300': !isSignUp}" class="p-2 text-white rounded">
        Sign Up
      </button>
      <button @click="isSignUp = false" :class="{'bg-green-500': !isSignUp, 'bg-gray-300': isSignUp}" class="p-2 text-white rounded">
        Sign In
      </button>
    </div>

    <!-- サインアップフォーム -->
    <form v-if="isSignUp" @submit.prevent="signUp" class="mb-4">
      <input v-model="signUpEmail" type="email" placeholder="Email" class="w-full p-2 border rounded mb-2" />
      <input v-model="signUpPassword" type="password" placeholder="Password" class="w-full p-2 border rounded mb-2" />
      <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded">Sign Up</button>
    </form>

    <!-- サインインフォーム -->
    <form v-if="!isSignUp" @submit.prevent="signIn">
      <input v-model="signInEmail" type="email" placeholder="Email" class="w-full p-2 border rounded mb-2" />
      <input v-model="signInPassword" type="password" placeholder="Password" class="w-full p-2 border rounded mb-2" />
      <button type="submit" class="w-full p-2 bg-green-500 text-white rounded">Sign In</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import type { Auth } from 'firebase/auth';

const signUpEmail = ref('');
const signUpPassword = ref('');
const signInEmail = ref('');
const signInPassword = ref('');
const errorMessage = ref<string | null>(null);
const isSignUp = ref(true); // サインアップフォームの初期状態を設定

const { $auth } = useNuxtApp();
const auth = $auth as Auth;

const signUp = async () => {
  if (!signUpEmail.value || !signUpPassword.value) {
    errorMessage.value = "Please provide both email and password.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail.value, signUpPassword.value);
    console.log('User signed up:', userCredential.user);
    errorMessage.value = null; // Clear error if successful
  } catch (error) {
    console.error('Error signing up:', error);
    errorMessage.value = "Failed to sign up. Please try again.";
  }
};

const signIn = async () => {
  if (!signInEmail.value || !signInPassword.value) {
    errorMessage.value = "Please provide both email and password.";
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, signInEmail.value, signInPassword.value);
    console.log('User signed in:', userCredential.user);
    errorMessage.value = null; // Clear error if successful
  } catch (error: any) {
    console.error('Error signing in:', error.message);
    if (error.code === 'auth/user-not-found') {
      errorMessage.value = 'User not found, please sign up first.';
    } else {
      errorMessage.value = "Failed to sign in. Please check your credentials.";
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
</script>