import { db } from "~/plugins/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export default defineEventHandler(async (event) => {
  const method = event.req.method;

  // ✅ TODOリストを取得（GET）
  if (method === "GET") {
    const todosSnapshot = await getDocs(collection(db, "todos"));
    const todos = todosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return todos;
  }

  // ✅ 新しいTODOを追加（POST）
  if (method === "POST") {
    const body = await readBody(event);
    const newTodo = { text: body.text, done: false };
    const docRef = await addDoc(collection(db, "todos"), newTodo);
    return { id: docRef.id, ...newTodo };
  }

  return { error: "Method not allowed on /api/todos" };
});
