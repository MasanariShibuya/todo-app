<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-2xl mx-auto py-8">
      <h1 class="text-3xl font-bold text-center mb-4">Todo App</h1>
      
      <!-- Todo Input -->
      <form @submit.prevent="addTodo" class="mb-4 flex space-x-2" v-if="isLoggedIn && !isEditing">
        <input
          v-model="newTodo"
          type="text"
          class="w-full p-2 border rounded"
          placeholder="Add a new todo"
        />
        <button type="submit" class="p-2 bg-blue-500 text-white rounded">Add</button>
      </form>

      <!-- Todo Edit Form -->
      <form @submit.prevent="updateTodo" v-if="isEditing" class="mb-4 flex space-x-2">
        <input
          v-model="editedTodoText"
          type="text"
          class="w-full p-2 border rounded"
          placeholder="Edit your todo"
        />
        <button type="submit" class="p-2 bg-yellow-500 text-white rounded">Update</button>
        <button @click="cancelEdit" type="button" class="p-2 bg-gray-500 text-white rounded">Cancel</button>
      </form>

      <!-- Todo List -->
      <ul class="space-y-2">
        <li v-for="todo in todos" :key="todo.id" class="flex justify-between items-center p-2 bg-white shadow rounded">
          <span>{{ todo.text }}</span>
          <button @click="deleteTodo(todo.id)" class="text-red-500">Delete</button>
          <button @click="editTodo(todo)" class="text-blue-500">Edit</button>
        </li>
      </ul>

      <!-- Sign In Form -->
      <div v-if="!isLoggedIn" class="flex justify-center">
        <form @submit.prevent="signIn" class="mb-4 flex flex-col space-y-4 w-full max-w-sm">
          <input
            v-model="email"
            type="email"
            class="w-full p-2 border rounded"
            placeholder="Email"
            required
          />
          <input
            v-model="password"
            type="password"
            class="w-full p-2 border rounded"
            placeholder="Password"
            required
          />
          <button type="submit" class="w-full p-2 bg-green-500 text-white rounded">Sign In</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';

const newTodo = ref('');
const todos = ref<{ id: string; text: string }[]>([]);
const email = ref('');
const password = ref('');
const isLoggedIn = ref(false);  // ログイン状態を管理
const { $auth } = useNuxtApp();

// 編集用の変数
const isEditing = ref(false);
const editedTodoText = ref('');
const editedTodoId = ref<string | null>(null);

// Firebase Firestoreの初期化
const db = getFirestore();

// Firebase Authenticationの初期化
const auth = getAuth();

// Authステータスの監視
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;  // ログインしている場合
      fetchTodos();  // Todoリストを取得
    } else {
      isLoggedIn.value = false;  // ログインしていない場合
    }
  });
});

// FirestoreからTodoリストを取得
const fetchTodos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'todos'));
    todos.value = querySnapshot.docs.map(doc => ({ id: doc.id, text: doc.data().text }));
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
};

// TodoをFirestoreに追加
const addTodo = async () => {
  if (newTodo.value.trim()) {
    try {
      await addDoc(collection(db, 'todos'), {
        text: newTodo.value,
      });
      newTodo.value = '';
      fetchTodos();  // Todoリストを更新
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }
};

// TodoをFirestoreから削除
const deleteTodo = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'todos', id));
    todos.value = todos.value.filter(todo => todo.id !== id);  // フロントエンドの配列も更新
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};

// TodoをFirestoreで更新
const updateTodo = async () => {
  if (editedTodoText.value.trim()) {
    try {
      const todoRef = doc(db, 'todos', editedTodoId.value as string);
      await updateDoc(todoRef, { text: editedTodoText.value });
      isEditing.value = false;  // 編集モードを終了
      editedTodoText.value = '';  // 入力をクリア
      fetchTodos();  // Todoリストを更新
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }
};

// 編集モードを開始
const editTodo = (todo: { id: string; text: string }) => {
  editedTodoId.value = todo.id;
  editedTodoText.value = todo.text;
  isEditing.value = true;
};

// 編集モードをキャンセル
const cancelEdit = () => {
  isEditing.value = false;
  editedTodoText.value = '';  // 入力をクリア
};
</script>
