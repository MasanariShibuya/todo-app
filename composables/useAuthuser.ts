import { ref } from 'vue'

export const useAuthUser = () => {
  const authUser = ref<{ uid: string; email: string } | null>(null)
  return authUser
}
