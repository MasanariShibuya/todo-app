<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <h1 class="text-3xl font-bold text-center mb-4">Todo App</h1>
      <div class="flex justify-end">
        <LogoutButton v-if="isLoggedIn" />
      </div>
      
      <!-- フィルターボタン -->
      <div class="flex justify-center mb-4 space-x-2 flex-wrap">
        <button @click="activeFilter = 'all'"
          :class="activeFilter === 'all' ? 'bg-lime-500 text-white' : 'bg-gray-200 text-gray-700'"
          class="px-4 py-2 rounded focus:outline-none">
          すべて
        </button>
        <button @click="activeFilter = 'not_started'"
          :class="activeFilter === 'not_started' ? 'bg-lime-500 text-white' : 'bg-gray-200 text-gray-700'"
          class="px-4 py-2 rounded focus:outline-none">
          未着手
        </button>
        <button @click="activeFilter = 'in_progress'"
          :class="activeFilter === 'in_progress' ? 'bg-lime-500 text-white' : 'bg-gray-200 text-gray-700'"
          class="px-4 py-2 rounded focus:outline-none">
          進行中
        </button>
        <button @click="activeFilter = 'completed'"
          :class="activeFilter === 'completed' ? 'bg-lime-500 text-white' : 'bg-gray-200 text-gray-700'"
          class="px-4 py-2 rounded focus:outline-none">
          完了
        </button>
      </div>

      <!-- Todo Input -->
      <form @submit.prevent="isEditing ? updateTodo() : addTodo()" class="mb-4 flex space-x-2" v-if="isLoggedIn">
        <input v-model="newTodo" type="text" class="w-full p-2 border rounded focus:outline-none" placeholder="新しいタスクを追加" />
        <input v-model="dueDate" type="date" class="p-2 border rounded focus:outline-none" :min="today" />
        <button type="submit" class="p-2 text-white rounded hover:bg-blue-600"
          :class="isEditing ? 'bg-green-500' : 'bg-cyan-600'">
          {{ isEditing ? '保存' : '追加' }}
        </button>
        <button v-if="isEditing" @click="cancelEdit" class="p-2 bg-gray-400 text-white rounded">キャンセル</button>
      </form>

      <!-- Todo List -->
      <ul class="space-y-2">
        <li v-for="todo in filteredTodos" :key="todo.id" class="flex items-center p-3 bg-white shadow rounded-md">
          <!-- 日付 -->
          <span class="text-sm text-gray-500 w-24">
            {{ todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : '期限なし' }}
          </span>

          <!-- ステータス変更ドロップダウン -->
          <select v-model="todo.status" @change="updateTaskStatus(todo.id, todo.status)"
            class="p-1 border rounded bg-gray-100 text-gray-700 focus:outline-none">
            <option value="not_started">未着手</option>
            <option value="in_progress">進行中</option>
            <option value="completed">完了</option>
          </select>

          <!-- タスク名 -->
          <span class="flex-1 text-center px-4">{{ todo.text }}</span>

          <!-- 編集・削除ボタン -->
          <div class="flex gap-2">
            <button @click="deleteTodo(todo.id)" class="text-red-500 hover:underline">削除</button>
            <button @click="editTodo(todo)" class="text-emerald-400 hover:underline">編集</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs, updateDoc, query } from 'firebase/firestore';

const newTodo = ref('');
const dueDate = ref('');
const todos = ref<{ id: string; text: string; status: string; dueDate: string | null }[]>([]);
const isLoggedIn = ref(false);
const userId = ref<string | null>(null);
const activeFilter = ref<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
const db = getFirestore();
const auth = getAuth();
const router = useRouter();
const isEditing = ref(false);
const editingTodoId = ref<string | null>(null);
const today = new Date().toISOString().split('T')[0]; // 今日の日付を取得

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      userId.value = user.uid;
      fetchTodos();
    } else {
      isLoggedIn.value = false;
      userId.value = null;
      router.push('/login');
    }
  });
});

const fetchTodos = async () => {
  if (!userId.value) return;
  try {
    const q = query(collection(db, `users/${userId.value}/todos`));
    const querySnapshot = await getDocs(q);
    todos.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      text: doc.data().text,
      status: doc.data().status || "not_started",
      dueDate: doc.data().dueDate || null,
    }));
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
};

const addTodo = async () => {
  if (newTodo.value.trim() && userId.value) {
    try {
      await addDoc(collection(db, `users/${userId.value}/todos`), {
        text: newTodo.value,
        status: "not_started",
        dueDate: dueDate.value || null,
        createdAt: new Date(),
      });
      newTodo.value = '';
      dueDate.value = '';
      fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }
};

const editTodo = (todo: { id: string; text: string; dueDate: string | null }) => {
  isEditing.value = true;
  editingTodoId.value = todo.id;
  newTodo.value = todo.text;
  dueDate.value = todo.dueDate || '';
};

const updateTodo = async () => {
  if (!editingTodoId.value || !userId.value) return;

  try {
    await updateDoc(doc(db, `users/${userId.value}/todos`, editingTodoId.value), {
      text: newTodo.value,
      dueDate: dueDate.value || null,
    });

    isEditing.value = false;
    editingTodoId.value = null;
    newTodo.value = '';
    dueDate.value = '';

    fetchTodos();
  } catch (error) {
    console.error('Error updating todo:', error);
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  editingTodoId.value = null;
  newTodo.value = '';
  dueDate.value = '';
};

const deleteTodo = async (id: string) => {
  try {
    await deleteDoc(doc(db, `users/${userId.value}/todos`, id));
    todos.value = todos.value.filter(todo => todo.id !== id);
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};

const updateTaskStatus = async (taskId: string, newStatus: string) => {
  if (!userId.value) return;
  try {
    await updateDoc(doc(db, `users/${userId.value}/todos`, taskId), { status: newStatus });
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

const filteredTodos = computed(() => {
  if (activeFilter.value === 'all') return todos.value;
  return todos.value.filter(todo => todo.status === activeFilter.value);
});
</script>

<style scoped>
/* スマホ用にパディングやマージン調整 */
@media (max-width: 640px) {
  .p-4 {
    padding: 1rem;
  }
  .mb-4 {
    margin-bottom: 1rem;
  }
  .text-3xl {
    font-size: 1.75rem;
  }
}
</style>