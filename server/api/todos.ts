import { db } from "../utils/firebase";  // ✅ Firestore のインスタンスを取得
import { collection, getDocs, addDoc } from "firebase/firestore";
import { defineEventHandler, readBody } from 'h3';

// ✅ GET: Todo 一覧を取得
export default defineEventHandler(async (event) => {
  if (event.node.req.method === "GET") {
    const todosCollection = collection(db, "todos");
    const snapshot = await getDocs(todosCollection);
    const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return todos;
  }

  // ✅ POST: Todo を追加
  if (event.node.req.method === "POST") {
    const body = await readBody(event);
    if (!body.text) {
      throw createError({ statusCode: 400, statusMessage: "Text is required" });
    }
    const docRef = await addDoc(collection(db, "todos"), { text: body.text });
    return { id: docRef.id, text: body.text };
  }
});
