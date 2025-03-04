<!-- ~/components/LogoutButton.vue -->
<template>
    <button @click="logout" class="bg-red-500 text-white p-2 rounded">Log Out</button>
  </template>
  
  <script setup>
  import { getAuth, signOut } from 'firebase/auth'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const logout = async () => {
    const auth = getAuth()
    try {
      await signOut(auth)
      router.push('/login')  // ログアウト後にログインページにリダイレクト
    } catch (err) {
      console.error(err)
    }
  }
  </script>
  