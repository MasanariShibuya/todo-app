<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-2xl mx-auto py-8">
      <h1 class="text-3xl font-bold text-center mb-6">Todo App</h1>
      <div class="flex justify-end">
        <LogoutButton v-if="isLoggedIn" />
      </div>

      <!-- フィルターボタン -->
      <div class="flex justify-center mb-4 space-x-2">
        <button @click="activeFilter = 'all'"
          :class="activeFilter === 'all' ? 'bg-lime-500 text-white' : 'bg-gray-200 text-gray-700'"
          class="px-4 py-2 rounded">
          すべて
        </button>
        <button @click="activeFilter = 'not_started'"
          :class="activeFilter === 'not_started' ? 'bg-lime-500 text-white' : 'bg-gray-200 text-gray-700'"
          class="px-4 py-2 rounded">
          未着手
        </button>
        <button @click="activeFilter = 'in_progress'"
          :class="activeFilter === 'in_progress' ? 'bg-lime-500 text-white' : 'bg-gray-200 text-gray-700'"
          class="px-4 py-2 rounded">
          進行中
        </button>
        <button @click="activeFilter = 'completed'"
          :class="activeFilter === 'completed' ? 'bg-lime-500 text-white' : 'bg-gray-200 text-gray-700'"
          class="px-4 py-2 rounded">
          完了
        </button>
      </div>

      <!-- Todo Input -->
      <form @submit.prevent="isEditing ? updateTodo() : addTodo()" 
            class="mb-6 flex flex-wrap gap-2 items-center justify-center sm:justify-start" 
            v-if="isLoggedIn">
        
        <input v-model="newTodo" type="text" class="w-full sm:w-auto flex-grow p-2 border rounded" placeholder="新しいタスクを追加" />
        
         <!-- カレンダーアイコン付き日付入力 -->
         <div class="relative w-full sm:w-auto">
          <input v-model="dueDate" type="date" class="w-full p-2 pl-10 border rounded cursor-pointer sm:w-33" :min="today" />
          <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
            📅
          </span>
        </div>

        <!-- 追加・キャンセルボタン -->
        <div class="flex gap-2 items-center">
          <button type="submit" class="px-4 py-2 text-white rounded hover:bg-blue-600 text-lg"
            :class="isEditing ? 'bg-green-500' : 'bg-cyan-600'">
            {{ isEditing ? '保存' : '追加' }}
          </button>
          <button v-if="isEditing" @click="cancelEdit" class="px-4 py-2 bg-gray-400 text-white rounded text-lg">キャンセル</button>
        </div>
      </form>

      <!-- Todo List -->
      <ul class="space-y-4">
        <li v-for="todo in filteredTodos" :key="todo.id" class="flex flex-col sm:flex-row items-center bg-white shadow rounded p-4 gap-2">
          
          <!-- 期限とステータス（スマホでは縦並び、PCでは横並び） -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full sm:w-auto">
            <span class="text-sm text-gray-500">
              {{ todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('ja-JP') : '期限なし' }}
            </span>
            <select v-model="todo.status" @change="updateTaskStatus(todo.id, todo.status)"
              class="p-1 border rounded bg-gray-100 text-gray-700 w-full sm:w-auto">
              <option value="not_started">未着手</option>
              <option value="in_progress">進行中</option>
              <option value="completed">完了</option>
            </select>
          </div>

          <!-- タスク名（常に中央で太字） -->
          <span class="w-full text-center font-bold text-lg">
            {{ todo.text }}
          </span>

          <!-- 編集・削除ボタン（常に右側に配置） -->
          <div class="flex flex-row gap-2">
            <button @click="editTodo(todo)" class="px-2 py-1 text-white bg-emerald-400 rounded">編集</button>
            <button @click="deleteTodo(todo.id)" class="px-2 py-1 text-white bg-red-500 rounded">削除</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* 期限なしテキストを横書きにする */
.text-sm.text-gray-500 {
  white-space: nowrap;
}
</style>





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
//morimori
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
