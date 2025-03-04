// ~/plugins/authState.client.ts
import { defineNuxtPlugin } from '#app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useAuthUser } from '~/composables/useAuthuser'
import { useRouter } from 'vue-router'

export default defineNuxtPlugin(() => {
  const auth = getAuth()
  const authUser = useAuthUser()
  const router = useRouter()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      authUser.value = {
        uid: user.uid,
        email: user.email || '',
      }
    } else {
      authUser.value = null
      router.push('/login')  // ログインしていない場合はログインページにリダイレクト
    }
  })
})
