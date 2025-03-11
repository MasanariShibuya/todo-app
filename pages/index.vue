<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-2xl mx-auto py-8">
      <h1 class="text-3xl font-bold text-center mb-4">Todo App</h1>

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
      <form @submit.prevent="addTodo" class="mb-4 flex space-x-2" v-if="isLoggedIn && !isEditing">
        <input v-model="newTodo" type="text" class="w-full p-2 border rounded" placeholder="Add a new todo" />
        <input v-model="dueDate" type="date" class="p-2 border rounded" />
        <button type="submit" class="p-2 bg-cyan-600 text-white rounded hover:bg-blue-600">Add</button>
      </form>

      <!-- Todo List -->
      <ul class="space-y-2">
        <li v-for="todo in filteredTodos" :key="todo.id" class="flex items-center p-2 bg-white shadow rounded">
          <!-- 日付 -->
          <span class="text-sm text-gray-500 w-24">
            {{ todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date' }}
          </span>

          <!-- ステータス変更ドロップダウン -->
          <select v-model="todo.status" @change="updateTaskStatus(todo.id, todo.status)"
            class="p-1 border rounded bg-gray-100 text-gray-700">
            <option value="not_started">未着手</option>
            <option value="in_progress">進行中</option>
            <option value="completed">完了</option>
          </select>

          <!-- タスク名 -->
          <span class="flex-1 text-center px-4">{{ todo.text }}</span>

          <!-- 編集・削除ボタン -->
          <div class="flex gap-2">
            <button @click="deleteTodo(todo.id)" class="text-red-500">Delete</button>
            <button @click="editTodo(todo)" class="text-emerald-400">Edit</button>
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
  newTodo.value = todo.text;
  dueDate.value = todo.dueDate || '';
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
