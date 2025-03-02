// server/api/todos.ts
import { db } from "../utils/firebase";  // パスが正しいことを確認

import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

// ここからはFirestoreの操作を行うコード
export default defineEventHandler(async (event) => {
  if (event.req.method === "GET") {
    const querySnapshot = await getDocs(collection(db, "todos"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  if (event.req.method === "POST") {
    const body = await readBody(event);
    const docRef = await addDoc(collection(db, "todos"), body);
    return { id: docRef.id, ...body };
  }

  if (event.req.method === "DELETE") {
    const { id } = getQuery(event);
    if (!id || typeof id !== "string") {
      throw new Error("Valid ID is required for deletion.");
    }
    
    const todoRef = doc(collection(db, "todos"), id);
    await deleteDoc(todoRef);
    
    return { message: "Todo deleted" };
  }
});
