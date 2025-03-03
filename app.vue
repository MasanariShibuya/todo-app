<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-2xl mx-auto py-8">
      <h1 class="text-3xl font-bold text-center mb-4">Todo App</h1>
      
      <!-- Todo Input -->
      <form @submit.prevent="addTodo" class="mb-4 flex space-x-2">
        <input
          v-model="newTodo"
          type="text"
          class="w-full p-2 border rounded"
          placeholder="Add a new todo"
        />
        <button type="submit" class="p-2 bg-blue-500 text-white rounded">Add</button>
      </form>

      <!-- Todo List -->
      <ul class="space-y-2">
        <li v-for="todo in todos" :key="todo.id" class="flex justify-between items-center p-2 bg-white shadow rounded">
          <span>{{ todo.text }}</span>
          <button @click="deleteTodo(todo.id)" class="text-red-500">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAsyncData } from 'nuxt/app'

type Todo = {
  id: string;
  text: string;
};

const newTodo = ref('')
const todos = ref<Todo[]>([])

const fetchTodos = async () => {
  const { data } = await useAsyncData<Todo[]>('todos', () => $fetch('/api/todos'))
  todos.value = data.value || []
}

const addTodo = async () => {
  if (newTodo.value.trim()) {
    await $fetch('/api/todos', {
      method: 'POST',
      body: { text: newTodo.value },
    })
    newTodo.value = ''
    fetchTodos() 
  }
}

// 🔽 修正ポイント 3 のコードをここに置く
const deleteTodo = async (id: string) => {
  console.log("Deleting todo with ID:", id); // ✅ デバッグ用ログ

  try {
    const response = await $fetch(`/api/todos/${id}`, { method: 'DELETE' });
    console.log("Delete response:", response); // ✅ APIのレスポンスを確認

    // ✅ フロントエンド側の配列から削除（API呼び出し後に更新）
    todos.value = todos.value.filter(todo => todo.id !== id);
  } catch (error) {
    console.error("Failed to delete todo:", error); // ✅ エラー時のログ
  }
};

onMounted(fetchTodos)
</script>
