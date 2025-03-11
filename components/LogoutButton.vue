<!-- ~/components/LogoutButton.vue -->
<template>
  <button @click="logout" class="absolute top-4 right-4 px-4 py-2 bg-stone-500 text-white p-2 rounded">ログアウト</button>
</template>

<script setup>
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = async () => {
  const auth = getAuth()
  try {
    await signOut(auth)
    console.log('ログアウト成功') // ログアウト成功時にメッセージを表示
    router.push('/login')  // ログアウト後にログインページにリダイレクト
  } catch (err) {
    console.error('ログアウトエラー:', err.message)
    alert('ログアウトに失敗しました。再度お試しください。')
  }
}
</script>
