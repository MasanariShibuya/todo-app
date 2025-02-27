<template>
  <div class="max-w-lg mx-auto mt-10 p-5 bg-white shadow rounded-lg">
    <h1 class="text-2xl font-bold mb-4">TODOアプリ</h1>
    <form @submit.prevent="addTodo">
      <input
        v-model="newTodo"
        type="text"
        placeholder="新しいTODO"
        class="border p-2 w-full rounded"
      />
      <button class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">追加</button>
    </form>

    <ul class="mt-4">
      <li
        v-for="todo in todos"
        :key="todo.id"
        class="flex justify-between items-center bg-gray-100 p-2 my-1 rounded"
      >
        <span :class="{ 'line-through': todo.done }" @click="toggleDone(todo)">
          {{ todo.text }}
        </span>
        <button @click="removeTodo(todo.id)" class="text-red-500">削除</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useFetch } from "#app";

// ✅ 型定義を追加
interface Todo {
  id: string; // Firestore の ID は string
  text: string;
  done: boolean;
}

// ✅ 型を明示して `useFetch` を使用
const { data: todos, refresh } = useFetch<Todo[]>("/api/todos");
const newTodo = ref("");

// ✅ TODO を追加する
const addTodo = async () => {
  if (!newTodo.value.trim()) return;
  await $fetch("/api/todos", {
    method: "POST",
    body: { text: newTodo.value },
  });
  newTodo.value = "";
  refresh();
};

// ✅ TODO の完了状態を切り替える
const toggleDone = async (todo: Todo) => {
  await $fetch(`/api/todos/${todo.id}`, {
    method: "PATCH",
    body: { done: !todo.done },
  });
  refresh();
};

// ✅ TODO を削除する
const removeTodo = async (id: string) => {
  await $fetch(`/api/todos/${id}`, {
    method: "DELETE",
  });
  refresh();
};
</script>
