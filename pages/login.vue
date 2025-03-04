<template>
    <div>
      <h1>ログイン画面</h1>
      <form @submit.prevent="login">
        <input type="email" v-model="email" placeholder="Email" />
        <input type="password" v-model="password" placeholder="Password" />
        <button type="submit">ログイン</button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const email = ref('')
  const password = ref('')
  
  const login = () => {
    // ログイン処理をここに書きます
    console.log('Logging in with', email.value, password.value)
  }
  </script>
  
  <style scoped>
  /* スタイルはここに追加 */
  </style>
  